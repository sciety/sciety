import { URL } from 'url';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from './crossref-work';
import { PaperExpression } from '../../../types/paper-expression';
import * as EDOI from '../../../types/expression-doi';
import { ArticleServer, articleServers } from '../../../types/article-server';

export const identifyExpressionServer = (url: string): O.Option<ArticleServer> => pipe(
  articleServers,
  R.filter((info) => url.includes(`://${info.domain}`)),
  R.keys,
  A.match(
    () => O.none,
    (keys) => O.some(keys[0] as ArticleServer),
  ),
);

export const toPaperExpression = (crossrefWork: CrossrefWork): PaperExpression => ({
  expressionDoi: EDOI.fromValidatedString(crossrefWork.DOI),
  publishedAt: new Date(
    crossrefWork.posted['date-parts'][0][0],
    crossrefWork.posted['date-parts'][0][1] - 1,
    crossrefWork.posted['date-parts'][0][2],
  ),
  publisherHtmlUrl: new URL(crossrefWork.resource.primary.URL),
  server: identifyExpressionServer(crossrefWork.resource.primary.URL),
});
