export const ingestionWindowStartDate = (
  ingestDays: number,
): Date => new Date(Date.now() - ingestDays * 24 * 60 * 60 * 1000);
