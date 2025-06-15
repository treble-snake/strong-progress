import fs from 'fs';
import path from 'path';
import {mapStrongAppData} from "../engine/parsing";
import {analyzeProgressiveOverload} from "../engine/progression";
import {parseStrongCsv} from "@/engine/file-reader/server-file-reader";


// Path to the CSV file
const csvFilePath = path.join(__dirname, '../../tmp/strong_06_06_2025.csv');

const outputFiles = [
  path.join(__dirname, '../../tmp/parsed-workout-data.json'),
  path.join(__dirname, '../../public/parsed-workout-data.json')
]

// Main function
async function main() {
  try {
    const result = analyzeProgressiveOverload(
      mapStrongAppData(await parseStrongCsv(csvFilePath))
    )
    console.log('Parsed workout data:', result.length);

    // Save the sorted JSON data to a file in the tmp/ folder
    for (const target of outputFiles) {
      fs.writeFileSync(target, JSON.stringify(result, null, 2));
      console.log(`\nSaved parsed workout data to ${target} (ordered by progress status)`);
    }
  } catch (error) {
    console.error('Error processing workout data:', error);
  }
}

const start = Date.now();
main()
  .then(() => {
    console.log('Processing completed successfully in', (Date.now() - start), 'ms');
  })
  .catch(error => console.error(error));
