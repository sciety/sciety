export const deprecatedIngestionWindowStartDate = (defaultDays: number): Date => {
  let days = parseInt(process.env.INGEST_DAYS ?? '', 10);
  if (Number.isNaN(days)) {
    days = defaultDays;
  }
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

export const ingestionWindowStartDate = (
  ingestDays: number,
): Date => new Date(Date.now() - ingestDays * 24 * 60 * 60 * 1000);
