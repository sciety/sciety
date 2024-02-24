import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { CrossrefWork } from './crossref-work.js';
import { PaperExpression } from '../../../types/paper-expression.js';
import * as EDOI from '../../../types/expression-doi.js';
import { identifyExpressionServer } from './identify-expression-server.js';
import * as crossrefDate from './date-stamp.js';

export const toPaperExpression = (crossrefWork: CrossrefWork): E.Either<unknown, PaperExpression> => {
  switch (crossrefWork.type) {
    case 'posted-content':
      return E.right({
        expressionType: 'preprint',
        expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
        publishedAt: crossrefDate.toDate(crossrefWork.posted),
        publishedTo: crossrefWork.DOI,
        publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
        server: identifyExpressionServer(crossrefWork.resource.primary.URL),
      });
    case 'journal-article':
      return E.right({
        expressionType: 'journal-article',
        expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
        publishedAt: crossrefDate.toDate(crossrefWork.published),
        publishedTo: crossrefWork.DOI,
        publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
        server: identifyExpressionServer(crossrefWork.resource.primary.URL),
      });
    case 'other':
      return E.left('unrecognised Crossref work type');
  }
};
