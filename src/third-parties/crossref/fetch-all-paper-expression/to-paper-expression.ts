import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as EDOI from '../../../types/expression-doi';
import { PaperExpression } from '../../../types/paper-expression';
import { CrossrefWork } from './crossref-work';

export const toPaperExpression = (crossrefWork: CrossrefWork): PaperExpression => ({
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: new Date(
    crossrefWork.posted['date-parts'][0][0],
    crossrefWork.posted['date-parts'][0][1] - 1,
    crossrefWork.posted['date-parts'][0][2],
  ),
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: O.none,
});
