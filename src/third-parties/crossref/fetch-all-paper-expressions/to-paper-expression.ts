import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { isCrossrefWorkPostedContent, SupportedCrossrefWork } from './crossref-work';
import { PaperExpression } from '../../../types/paper-expression';
import * as EDOI from '../../../types/expression-doi';
import { identifyExpressionServer } from './identify-expression-server';
import { determinePublicationDate } from './determine-publication-date';

const determineExpressionType = (crossrefWorkType: SupportedCrossrefWork['type']): PaperExpression['expressionType'] => {
  switch (crossrefWorkType) {
    case 'posted-content':
      return 'preprint';
    case 'journal-article':
      return 'journal-article';
  }
};

export const toPaperExpression = (crossrefWork: SupportedCrossrefWork): E.Either<unknown, PaperExpression> => E.right({
  expressionType: determineExpressionType(crossrefWork.type),
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: isCrossrefWorkPostedContent(crossrefWork)
    ? determinePublicationDate(crossrefWork.posted)
    : determinePublicationDate(crossrefWork.published),
  publishedTo: crossrefWork.DOI,
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: identifyExpressionServer(crossrefWork.resource.primary.URL),
});
