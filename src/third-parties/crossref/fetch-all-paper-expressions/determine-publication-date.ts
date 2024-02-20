import { CrossrefDate } from './crossref-work';

export const determinePublicationDate = (date: CrossrefDate): Date => {
  const dateParts = date['date-parts'][0];
  return new Date(
    dateParts[0],
    dateParts[1] ? dateParts[1] - 1 : 0,
    dateParts[2] ?? 1,
  );
};
