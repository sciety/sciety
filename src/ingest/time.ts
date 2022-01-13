export const daysAgo = (defaultDays: number): Date => {
  let days = parseInt(process.env.INGEST_DAYS ?? '', 10);
  if (Number.isNaN(days)) {
    days = defaultDays;
  }
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};
