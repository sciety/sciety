import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../../third-parties';
import * as PES from '../../types/paper-expressions';
import { PaperExpression } from '../../types/paper-expression';

export const findAllExpressionsOfPaper: ExternalQueries['findAllExpressionsOfPaper'] = (expressionDoi) => pipe(
  [
    {
      expressionType: 'preprint',
      expressionDoi,
      publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
      publishedAt: new Date('1970'),
      server: O.some('biorxiv'),
    } satisfies PaperExpression,
    {
      expressionType: 'preprint',
      expressionDoi,
      publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
      publishedAt: new Date('1980'),
      server: O.some('biorxiv'),
    } satisfies PaperExpression,
  ],
  PES.fromExpressions,
  TE.right,
);
