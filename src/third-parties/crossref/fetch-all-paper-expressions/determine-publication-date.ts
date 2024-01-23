import { CrossrefWork, isCrossrefWorkPostedContent } from './crossref-work';

export const determinePublicationDate = (crossrefWork: CrossrefWork): Date => {
  if (isCrossrefWorkPostedContent(crossrefWork)) {
    return new Date(
      crossrefWork.posted['date-parts'][0][0],
      crossrefWork.posted['date-parts'][0][1] - 1,
      crossrefWork.posted['date-parts'][0][2],
    );
  }
  return new Date(
    crossrefWork.published['date-parts'][0][0],
    crossrefWork.published['date-parts'][0][1] - 1,
    crossrefWork.published['date-parts'][0][2],
  );
};
