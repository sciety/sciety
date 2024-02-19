import { URL } from 'url';
import { SupportedCrossrefWork } from './crossref-work';
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

export const toPaperExpression = (crossrefWork: SupportedCrossrefWork): PaperExpression => ({
  expressionType: determineExpressionType(crossrefWork.type),
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: determinePublicationDate(crossrefWork),
  publishedTo: crossrefWork.DOI,
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: identifyExpressionServer(crossrefWork.resource.primary.URL),
});
