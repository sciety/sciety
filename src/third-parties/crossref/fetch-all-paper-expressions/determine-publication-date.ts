import { CrossrefWork, isCrossrefWorkPostedContent } from './crossref-work';

export const determinePublicationDate = (crossrefWork: CrossrefWork): Date => {
  const dateParts = isCrossrefWorkPostedContent(crossrefWork)
    ? crossrefWork.posted['date-parts'][0]
    : crossrefWork.published['date-parts'][0];
  return new Date(
    dateParts[0],
    dateParts[1] ? dateParts[1] - 1 : 0,
    dateParts[2] ?? 1,
  );
};
