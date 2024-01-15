import { URL } from 'url';
import { CrossrefWorkPostedContent } from './crossref-work';
import { PaperExpression } from '../../../types/paper-expression';
import * as EDOI from '../../../types/expression-doi';
import { identifyExpressionServer } from './identify-expression-server';

export const toPaperExpression = (crossrefWork: CrossrefWorkPostedContent): PaperExpression => ({
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: new Date(
    crossrefWork.posted['date-parts'][0][0],
    crossrefWork.posted['date-parts'][0][1] - 1,
    crossrefWork.posted['date-parts'][0][2],
  ),
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: identifyExpressionServer(crossrefWork.resource.primary.URL),
});
