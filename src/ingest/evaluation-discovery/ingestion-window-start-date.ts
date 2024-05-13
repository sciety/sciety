export const ingestionWindowStartDate = (
  ingestDays: number,
  earliestAllowedStartDate?: Date,
): Date => {
  const startDate = new Date(Date.now() - ingestDays * 24 * 60 * 60 * 1000);
  if (earliestAllowedStartDate !== undefined && startDate < earliestAllowedStartDate) {
    return earliestAllowedStartDate;
  }
  return startDate;
};
