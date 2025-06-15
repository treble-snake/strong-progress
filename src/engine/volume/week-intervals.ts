import dayjs from "dayjs";

type Week = {
  start: string
  end: string
  label: string
}


export const getWeeks = (from: string, to: string): Week[] => {
  const start = dayjs(from).startOf('day');
  const end = dayjs(to).endOf('day');
  const weeks: Week[] = [];

  let current = start;
  while (current.isBefore(end)) {
    const newWeekStart =current.add(6, 'days')
    weeks.push({
      start: current.format('YYYY-MM-DD'),
      end: newWeekStart.format('YYYY-MM-DD'),
      label: `Week ${current.format('ll')}-${newWeekStart.format('ll')}`
    })

    current = newWeekStart.add(1, 'day'); // Move to the next week
  }

  return weeks;
}
