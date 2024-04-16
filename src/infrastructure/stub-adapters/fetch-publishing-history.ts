import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../../third-parties';
import * as DE from '../../types/data-error';
import { PaperExpression } from '../../types/paper-expression';
import * as PH from '../../types/publishing-history';

export const fetchPublishingHistory: ExternalQueries['fetchPublishingHistory'] = (expressionDoi) => pipe(
  [
    {
      expressionType: 'preprint',
      expressionDoi,
      publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v1`),
      publishedAt: new Date('1970'),
      publishedTo: `${expressionDoi}v1`,
      server: O.some('biorxiv'),
    } satisfies PaperExpression,
    {
      expressionType: 'preprint',
      expressionDoi,
      publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v2`),
      publishedAt: new Date('1980'),
      publishedTo: `${expressionDoi}v2`,
      server: O.some('biorxiv'),
    } satisfies PaperExpression,
  ],
  PH.fromExpressions,
  E.mapLeft(() => DE.notFound),
  T.of,
);
