export const daysAgo = (days: number): Date => (
  new Date(Date.now() - days * 24 * 60 * 60 * 1000)
);
