import { getWeeks } from '../week-intervals';

describe('getWeeks', () => {
  // Basic functionality with spring months of 2025
  it('should generate weeks for March 2025', () => {
    const from = '2025-03-01';
    const to = '2025-03-31';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(5); // March has 31 days, so 5 weeks

    // Check first week
    expect(weeks[0].start).toBe('2025-03-01');
    expect(weeks[0].end).toBe('2025-03-07');
    expect(weeks[0].label).toContain('Week');
    // The label format uses 'll' which is a dayjs format token
    // Just check that it contains 'Week' as the specific format may vary

    // Check last week
    expect(weeks[4].start).toBe('2025-03-29');
    expect(weeks[4].end).toBe('2025-04-04');
  });

  it('should generate weeks for April 2025', () => {
    const from = '2025-04-01';
    const to = '2025-04-30';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(5); // April has 30 days, so 5 weeks

    // Check first week
    expect(weeks[0].start).toBe('2025-04-01');
    expect(weeks[0].end).toBe('2025-04-07');

    // Check last week
    expect(weeks[4].start).toBe('2025-04-29');
    expect(weeks[4].end).toBe('2025-05-05');
  });

  it('should generate weeks for May 2025', () => {
    const from = '2025-05-01';
    const to = '2025-05-31';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(5); // May has 31 days, so 5 weeks

    // Check first week
    expect(weeks[0].start).toBe('2025-05-01');
    expect(weeks[0].end).toBe('2025-05-07');

    // Check last week
    expect(weeks[4].start).toBe('2025-05-29');
    expect(weeks[4].end).toBe('2025-06-04');
  });

  // Cross-year testing with dates spanning 2024-2025
  it('should generate weeks across December 2024 to January 2025', () => {
    const from = '2024-12-20';
    const to = '2025-01-10';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(4); // 22 days, so 4 weeks

    // Check first week
    expect(weeks[0].start).toBe('2024-12-20');
    expect(weeks[0].end).toBe('2024-12-26');
    expect(weeks[0].label).toContain('Week');

    // Check week that spans the year change
    expect(weeks[1].start).toBe('2024-12-27');
    expect(weeks[1].end).toBe('2025-01-02');
    expect(weeks[1].label).toContain('Week');

    // Check last week
    expect(weeks[3].start).toBe('2025-01-10');
    expect(weeks[3].end).toBe('2025-01-16');
  });

  // Edge cases
  it('should handle exactly 12 weeks', () => {
    const from = '2025-03-01';
    const to = '2025-05-23'; // 12 weeks from March 1
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(12);
    expect(weeks[0].start).toBe('2025-03-01');
    expect(weeks[11].end).toBe('2025-05-23');
  });

  it('should handle less than 12 weeks', () => {
    const from = '2025-03-01';
    const to = '2025-04-30'; // About 8-9 weeks
    const weeks = getWeeks(from, to);

    expect(weeks.length).toBeLessThan(12);
    expect(weeks[0].start).toBe('2025-03-01');
    expect(weeks[weeks.length - 1].end).toMatch(/2025-05-\d{2}/); // Should end in early May
  });

  it('should handle a single day range', () => {
    const from = '2025-03-15';
    const to = '2025-03-15';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(1);
    expect(weeks[0].start).toBe('2025-03-15');
    expect(weeks[0].end).toBe('2025-03-21');
  });

  it('should handle a single week range', () => {
    const from = '2025-03-01';
    const to = '2025-03-07';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(1);
    expect(weeks[0].start).toBe('2025-03-01');
    expect(weeks[0].end).toBe('2025-03-07');
  });

  // Invalid inputs
  it('should return empty array if from date is after to date', () => {
    const from = '2025-05-01';
    const to = '2025-04-01';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(0);
  });

  it('should handle invalid date formats by returning empty array', () => {
    const from = 'invalid-date';
    const to = '2025-04-01';
    const weeks = getWeeks(from, to);

    expect(weeks).toHaveLength(0);
  });
});
