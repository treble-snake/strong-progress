import fs from 'fs';
import path from 'path';
import csvToJson from 'convert-csv-to-json';
import {ProgressStatus} from '../types';
import {addDays, isAfter, parseISO} from 'date-fns';

// filter out Excercise groups with less than 3 sets
const TOTAL_SETS_THRESHOLD = 3;
// Define the active period threshold (14 days)
const ACTIVE_DAYS_THRESHOLD = 14;

// Define the type for raw workout data based on the CSV structure
interface RawWorkoutData {
  Date: string;
  'Workout Name': string;
  Duration: string;
  'Exercise Name': string;
  'Set Order': string;
  Weight: string;
  Reps: string;
  Distance: string;
  Seconds: string;
  Notes: string;
  'Workout Notes': string;
  RPE: string;
}

// Define the type for workout data with lowerCamelCase field names
interface WorkoutData {
  date: string;
  workoutName: string;
  exerciseName: string;
  setOrder: string;
  weight: number; // float
  reps: number; // integer
  distance: number; // float
  seconds: number; // float
  notes: string;
  workoutNotes: string;
  rpe: number | null;
}

enum PerformanceChange {
  Increase = 'Increase',
  Decrease = 'Decrease',
  NoChange = 'No Change',
  NotSure = 'Not Sure'
}

// Helper function to convert performance change to symbol
function performanceChangeToSymbol(change: PerformanceChange): string {
  switch (change) {
    case PerformanceChange.Increase:
      return '↑';
    case PerformanceChange.Decrease:
      return '↓';
    case PerformanceChange.NoChange:
      return '-';
    case PerformanceChange.NotSure:
      return '?';
    default:
      return '?';
  }
}

// Helper function to determine progress status from recent performance
function determineProgressStatus(
  performanceHistory: PerformanceChange[],
  recentCount: number = 5
): ProgressStatus {
  if (performanceHistory.length <= 0) {
    return ProgressStatus.NeedsAttention;
  }

  const lastTwo = performanceHistory.slice(-2);
  if (lastTwo.every(p => p === PerformanceChange.Increase)) {
    return ProgressStatus.Progressing;
  }
  if (lastTwo.every(p => p === PerformanceChange.Decrease)) {
    return ProgressStatus.Regressing;
  }
  const lastThree = performanceHistory.slice(-3);
  if (lastThree.every(p => p === PerformanceChange.NoChange)) {
    return ProgressStatus.Plateaued;
  }

  const recent = performanceHistory.slice(-recentCount);
  const inc = recent.filter(p => p === PerformanceChange.Increase).length;
  const dec = recent.filter(p => p === PerformanceChange.Decrease).length;

  if (inc === 0) {
    return dec > 0 ?
      ProgressStatus.Regressing :
      ProgressStatus.Plateaued;
  }

  return ProgressStatus.NeedsAttention;
}

// Function to compare performance between two date groups
function comparePerformance(
  currentExercises: WorkoutData[],
  previousExercises: WorkoutData[]
): {
  topSetPerformance: PerformanceChange;
  overallPerformance: PerformanceChange
} {
  // For the first day or if missing data, return "No Change"
  if (!previousExercises || !currentExercises || previousExercises.length === 0 || currentExercises.length === 0) {
    return {
      topSetPerformance: PerformanceChange.NoChange,
      overallPerformance: PerformanceChange.NoChange
    };
  }

  // Sort exercises by setOrder to ensure we're comparing the right sets
  const sortedCurrentExercises = [...currentExercises].sort((a, b) => {
    // Handle special case where setOrder might be "F" (first) or other non-numeric values
    if (a.setOrder === "F") return -1;
    if (b.setOrder === "F") return 1;
    return parseInt(a.setOrder, 10) - parseInt(b.setOrder, 10);
  });

  const sortedPreviousExercises = [...previousExercises].sort((a, b) => {
    if (a.setOrder === "F") return -1;
    if (b.setOrder === "F") return 1;
    return parseInt(a.setOrder, 10) - parseInt(b.setOrder, 10);
  });

  // Get the first (top) set from each day
  const currentTopSet = sortedCurrentExercises[0];
  const previousTopSet = sortedPreviousExercises[0];

  // Compare top sets
  const topSetPerformance = compareExerciseSets(currentTopSet, previousTopSet);

  // Compare overall performance by checking all sets
  let overallPerformance = topSetPerformance;

  // If top sets are the same, continue checking other sets
  if (topSetPerformance === PerformanceChange.NoChange) {
    let allSetsIdentical = true;
    let setIndex = 1;

    // Compare each set until we find a difference or run out of sets
    while (
      setIndex < sortedCurrentExercises.length &&
      setIndex < sortedPreviousExercises.length &&
      allSetsIdentical
      ) {
      const currentSet = sortedCurrentExercises[setIndex];
      const previousSet = sortedPreviousExercises[setIndex];

      const setComparison = compareExerciseSets(currentSet, previousSet);

      if (setComparison !== PerformanceChange.NoChange) {
        overallPerformance = setComparison;
        allSetsIdentical = false;
      }

      setIndex++;
    }
  }

  return {topSetPerformance, overallPerformance};
}

// Helper function to compare two exercise sets
function compareExerciseSets(currentSet: WorkoutData, previousSet: WorkoutData): PerformanceChange {
  // Handle null or undefined sets
  if (!currentSet || !previousSet) {
    return PerformanceChange.NotSure;
  }

  const currentWeight = currentSet.weight;
  const previousWeight = previousSet.weight;
  const currentReps = currentSet.reps;
  const previousReps = previousSet.reps;

  // Handle zero or invalid values
  if (
    currentWeight === undefined ||
    previousWeight === undefined ||
    currentReps === undefined ||
    previousReps === undefined ||
    previousReps === 0
  ) {
    return PerformanceChange.NotSure;
  }

  // Check if reps are within ±50% of previous day
  const repsWithinRange = currentReps >= previousReps * 0.5 && currentReps <= previousReps * 1.5;

  // Compare weights and reps
  if (currentWeight > previousWeight) {
    // Weight is higher
    return repsWithinRange ? PerformanceChange.Increase : PerformanceChange.NotSure;
  } else if (currentWeight < previousWeight) {
    // Weight is lower
    return repsWithinRange ? PerformanceChange.Decrease : PerformanceChange.NotSure;
  } else {
    // Weight is the same
    if (currentReps > previousReps) {
      return PerformanceChange.Increase;
    } else if (currentReps < previousReps) {
      return PerformanceChange.Decrease;
    } else {
      // Both weight and reps are the same
      return PerformanceChange.NoChange;
    }
  }
}

// Define the type for date-grouped workout data
interface DateGroupedWorkoutData {
  date: string; // ISO format YYYY-MM-DD
  exercises: WorkoutData[];
  topSetPerformance?: PerformanceChange;
  overallPerformance?: PerformanceChange;
}

// Define the type for grouped workout data
interface GroupedWorkoutData {
  label: string; // Format: "{exerciseName} ({workoutName})"
  dateGroups: Record<string, DateGroupedWorkoutData>; // Grouped by date
  progressStatus?: ProgressStatus;
  isActive: boolean; // Whether the exercise was performed in the last two weeks
  lastPerformedDate: string; // Date the exercise was last performed
}

// Function to normalize workout names
function normalizeWorkoutName(workoutName: string): string {
  // TODO: not needed
  workoutName = workoutName.replaceAll('"', '').trim();
  // TODO: Clean up this special case in the future
  if (workoutName === "Pull Copy") {
    return "Pull";
  }
  return workoutName;
}

// TODO: not needed
function normalizeExerciseName(exerciseName: string): string {
  // Remove extra quotes and trim whitespace
  return exerciseName.replaceAll('"', '').trim();
}

// Path to the CSV file
const csvFilePath = path.join(__dirname, '../../tmp/strong_spring_2025.csv');

// Parse CSV to JSON
function parseCSVToJSON(): GroupedWorkoutData[] {
  try {
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`File not found: ${csvFilePath}`);
      return [];
    }

    // Convert CSV to JSON
    const jsonArray = csvToJson
      .fieldDelimiter(',')
      .supportQuotedField(true)
      .getJsonFromCsv(csvFilePath) as RawWorkoutData[];

    // Map from RawWorkoutData to WorkoutData with lowerCamelCase field names
    const mappedArray = jsonArray.map(record => {
      return {
        date: record.Date,
        workoutName: normalizeWorkoutName(record['Workout Name']),
        exerciseName: normalizeExerciseName(record['Exercise Name']),
        setOrder: record['Set Order'],
        weight: parseFloat(record.Weight) || 0, // Convert to float
        reps: parseInt(record.Reps, 10) || 0, // Convert to integer
        distance: parseFloat(record.Distance) || 0, // Convert to float
        seconds: parseFloat(record.Seconds) || 0, // Convert to float
        notes: record.Notes,
        workoutNotes: record['Workout Notes'],
        rpe: record.RPE === '' ? null : parseFloat(record.RPE) || null // Convert to number or null if empty or invalid
      };
    });

    // Filter out records where setOrder === "Rest Timer"
    const filteredArray = mappedArray.filter(record => record.setOrder !== "Rest Timer");

    // Filter out records where reps, distance, and seconds are all 0
    const filteredZeroArray = filteredArray.filter(record => !(record.reps === 0 && record.distance === 0 && record.seconds === 0));

    // Group the filtered data by exerciseName + workoutName, then by date
    const groupedData: Record<string, Record<string, WorkoutData[]>> = {};

    filteredZeroArray.forEach(record => {
      // Format the date to ISO format YYYY-MM-DD (extract just the date part)
      const isoDate = record.date.split(' ')[0]; // Extract YYYY-MM-DD from "YYYY-MM-DD HH:MM:SS"

      const exerciseWorkoutKey = `${record.exerciseName}|${record.workoutName}`;

      // Create the exercise+workout group if it doesn't exist
      if (!groupedData[exerciseWorkoutKey]) {
        groupedData[exerciseWorkoutKey] = {};
      }

      // Create the date group if it doesn't exist
      if (!groupedData[exerciseWorkoutKey][isoDate]) {
        groupedData[exerciseWorkoutKey][isoDate] = [];
      }

      // Add the record to the appropriate date group
      groupedData[exerciseWorkoutKey][isoDate].push(record);
    });

    // Get the current date to determine active/inactive status
    const currentDate = new Date();
    const twoWeeksAgo = addDays(currentDate, -ACTIVE_DAYS_THRESHOLD);

    // Convert the grouped data to an array of GroupedWorkoutData
    const result: GroupedWorkoutData[] = Object.entries(groupedData).map(([key, dateGroups]) => {
      const [exerciseName, workoutName] = key.split('|');
      // Note: workoutName is already normalized at this point since we normalized it during mapping

      // Convert the date groups to DateGroupedWorkoutData objects
      const formattedDateGroups: Record<string, DateGroupedWorkoutData> = {};

      // Sort dates chronologically to ensure proper performance comparison
      const sortedDates = Object.keys(dateGroups).sort();

      // Track the previous date's exercises for comparison
      let previousDateExercises: WorkoutData[] | null = null;

      // Collect performance history for progress status
      const performanceHistory: PerformanceChange[] = [];

      // Process each date in chronological order
      sortedDates.forEach((date) => {
        const exercises = dateGroups[date];

        // Calculate performance changes if we have a previous date to compare with
        let topSetPerformance = PerformanceChange.NoChange;
        let overallPerformance = PerformanceChange.NoChange;

        if (previousDateExercises) {
          const performance = comparePerformance(exercises, previousDateExercises);
          topSetPerformance = performance.topSetPerformance;
          overallPerformance = performance.overallPerformance;
        }

        // Store performance history for progress status
        if (topSetPerformance !== PerformanceChange.NoChange) {
          performanceHistory.push(topSetPerformance);
        }

        // Store the date group with performance information
        formattedDateGroups[date] = {
          date,
          exercises,
          topSetPerformance,
          overallPerformance
        };

        // Update previous date exercises for the next iteration
        previousDateExercises = exercises;
      });

      // Determine progress status for this group
      const progressStatus = determineProgressStatus(performanceHistory);

      const lastPerformedDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : "";

      // Determine if this is an active exercise (performed within the last two weeks)
      const isActive = sortedDates.length > 0 &&
        isAfter(parseISO(lastPerformedDate), twoWeeksAgo);

      return {
        label: `${exerciseName} (${workoutName})`,
        dateGroups: formattedDateGroups,
        progressStatus,
        isActive,
        lastPerformedDate
      };
    });

    // Filter out groups with total entries <= TOTAL_SETS_THRESHOLD
    const filteredResult = result.filter(group => {
      let totalExercises = 0;
      Object.values(group.dateGroups).forEach(dateGroup => {
        totalExercises += dateGroup.exercises.length;
      });
      return totalExercises > TOTAL_SETS_THRESHOLD;
    });

    console.log(`Successfully parsed ${mappedArray.length} workout records`);
    console.log(`Filtered out ${mappedArray.length - filteredArray.length} "Rest Timer" records`);
    console.log(`Filtered out ${filteredArray.length - filteredZeroArray.length} records with 0 reps, distance, and seconds`);
    console.log(`Grouped into ${result.length} exercise groups`);
    console.log(`Filtered out ${result.length - filteredResult.length} groups with <= ${TOTAL_SETS_THRESHOLD} entries`);

    // Sort the workout data:
    // 1. First by active status (active first)
    // 2. Then by progress status priority for active lifts
    // 3. Then by lastPerformedDate (descending) for history lifts
    const sortedWorkoutData = [...filteredResult].sort((a, b) => {
      // First sort by active status (active first)
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }

      // For active lifts, sort by progress status
      if (a.isActive) {
        return getProgressStatusPriority(a.progressStatus) - getProgressStatusPriority(b.progressStatus);
      }

      // For history lifts, sort by last performed date (most recent first)
      return new Date(b.lastPerformedDate).getTime() - new Date(a.lastPerformedDate).getTime();
    });

    // Save the sorted JSON data to a file in the tmp/ folder
    const outputFilePath = path.join(__dirname, '../../tmp/parsed-workout-data.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(sortedWorkoutData, null, 2));

    // Count active and history exercises for logging
    const activeCount = sortedWorkoutData.filter(item => item.isActive).length;
    const historyCount = sortedWorkoutData.length - activeCount;

    console.log(`\nSaved workout data to ${outputFilePath}`);
    console.log(`Active exercises: ${activeCount}`);
    console.log(`History exercises: ${historyCount}`);

    return sortedWorkoutData;
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    return [];
  }
}

// Function to display performance results in the required format
function displayPerformanceResults(groupedWorkoutData: GroupedWorkoutData[]): void {
  console.log('\nPerformance Results:');

  groupedWorkoutData.forEach(group => {
    // Get the dates in chronological order
    const sortedDates = Object.keys(group.dateGroups).sort();

    // Skip the first date as it always has "No Change" performance
    if (sortedDates.length <= 1) {
      return;
    }

    // Collect performance data for all dates except the first one
    let topSetPerformanceSymbols = '';
    let overallPerformanceSymbols = '';

    for (let i = 1; i < sortedDates.length; i++) {
      const dateGroup = group.dateGroups[sortedDates[i]];

      // Add symbols for top set and overall performance
      topSetPerformanceSymbols += performanceChangeToSymbol(dateGroup.topSetPerformance || PerformanceChange.NoChange);
      overallPerformanceSymbols += performanceChangeToSymbol(dateGroup.overallPerformance || PerformanceChange.NoChange);
    }

    // Output the results with two subrows and progress status
    console.log(`- ${group.label}:`);
    console.log(`  -- Top Set: ${topSetPerformanceSymbols}`);
    console.log(`  -- Overall: ${overallPerformanceSymbols}`);
    if (group.progressStatus) {
      console.log(`  -- Progress Status: ${group.progressStatus}`);
    }
  });
}

// Helper function to get priority of progress status for sorting
function getProgressStatusPriority(status?: ProgressStatus): number {
  switch (status) {
    case ProgressStatus.Regressing:
      return 1; // Show first
    case ProgressStatus.Plateaued:
      return 2;
    case ProgressStatus.NeedsAttention:
      return 3;
    case ProgressStatus.Progressing:
      return 4; // Show last
    default:
      return 5;
  }
}

// Main function
function main() {
  const groupedWorkoutData = parseCSVToJSON();

  // The sortedWorkoutData is already properly sorted in the parseCSVToJSON function,
  // so we don't need to sort it again here.

  if (groupedWorkoutData.length > 0) {
    // Display all top-level groups
    console.log('\nAll exercise groups:');
    groupedWorkoutData.forEach(group => {
      // Count total exercises across all date groups
      let totalExercises = 0;
      Object.values(group.dateGroups).forEach(dateGroup => {
        totalExercises += dateGroup.exercises.length;
      });

      console.log(`${group.label}: ${totalExercises} entries`);
    });

    // Find a group with approximately 10 entries to display as an example
    let exampleGroup = groupedWorkoutData[0]; // Default to first group
    let exampleGroupSize = 0;

    // Calculate the total size of the first group
    Object.values(exampleGroup.dateGroups).forEach(dateGroup => {
      exampleGroupSize += dateGroup.exercises.length;
    });

    // Try to find a group with closer to 10 entries
    for (const group of groupedWorkoutData) {
      let groupSize = 0;
      Object.values(group.dateGroups).forEach(dateGroup => {
        groupSize += dateGroup.exercises.length;
      });

      // If this group has a size closer to 10 than our current example, use it instead
      if (Math.abs(groupSize - 10) < Math.abs(exampleGroupSize - 10)) {
        exampleGroup = group;
        exampleGroupSize = groupSize;
      }

      // If we found a group with exactly 10 entries, no need to keep searching
      if (groupSize === 10) {
        break;
      }
    }

    // Display the example group with all its date subgroups
    console.log(`\nExample group: ${exampleGroup.label} (${exampleGroupSize} total entries)`);
    if (exampleGroup.progressStatus) {
      console.log(`  Progress Status: ${exampleGroup.progressStatus}`);
    }

    // Sort dates chronologically for display
    const sortedDates = Object.keys(exampleGroup.dateGroups).sort();

    sortedDates.forEach(date => {
      const dateGroup = exampleGroup.dateGroups[date];
      console.log(`\n  Date: ${date} (${dateGroup.exercises.length} entries)`);

      // Display performance changes if available
      if (dateGroup.topSetPerformance) {
        console.log(`    Top Set Performance: ${dateGroup.topSetPerformance}`);
        console.log(`    Overall Performance: ${dateGroup.overallPerformance}`);
      }

      // Display exercise details
      dateGroup.exercises.forEach(exercise => {
        console.log(`    Set: ${exercise.setOrder}, Weight: ${exercise.weight}, Reps: ${exercise.reps}`);
      });
    });

    // Display performance results in the required format
    displayPerformanceResults(groupedWorkoutData);

    // Save the sorted JSON data to a file in the tmp/ folder
    const outputFilePath = path.join(__dirname, '../../tmp/parsed-workout-data.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(groupedWorkoutData, null, 2));
    console.log(`\nSaved sorted workout data to ${outputFilePath} (ordered by progress status)`);
  } else {
    console.log('No workout data found');
  }
}

// Execute the main function
main();
