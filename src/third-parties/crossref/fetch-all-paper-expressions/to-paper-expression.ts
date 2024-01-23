import { URL } from 'url';
import { CrossrefWork } from './crossref-work';
import { PaperExpression } from '../../../types/paper-expression';
import * as EDOI from '../../../types/expression-doi';
import { identifyExpressionServer } from './identify-expression-server';
import { determinePublicationDate } from './determine-publication-date';

export const toPaperExpression = (crossrefWork: CrossrefWork): PaperExpression => ({
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: determinePublicationDate(crossrefWork),
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: identifyExpressionServer(crossrefWork.resource.primary.URL),
});
