export const getStartOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 0, 1);
};

export const getStartOfNextYear = (date: Date): Date => {
  return new Date(date.getFullYear() + 1, 0, 1);
};

export const calculatePercentage = (elapsed: number, total: number): number => {
  return (elapsed / total) * 100;
};

export const getTimeElapsed = (end: Date, start: Date): number => {
  return end.getTime() - start.getTime();
};

export const getYearProgress = (): number => {
  const now = new Date();
  const yearStart = getStartOfYear(now);
  const yearEnd = getStartOfNextYear(now);

  const totalMilliseconds = getTimeElapsed(yearEnd, yearStart);
  const elapsedMilliseconds = getTimeElapsed(now, yearStart);

  return calculatePercentage(elapsedMilliseconds, totalMilliseconds);
};
