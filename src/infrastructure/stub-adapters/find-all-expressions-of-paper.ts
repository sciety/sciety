import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { PaperExpression } from '../../types/paper-expression';
import { ExternalQueries } from '../../third-parties';

export const findAllExpressionsOfPaper: ExternalQueries['findAllExpressionsOfPaper'] = (expressionDoi) => T.of(E.right([
  {
    expressionType: 'preprint',
    expressionDoi,
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
    publishedAt: new Date('1970'),
    server: O.some('biorxiv'),
  },
  {
    expressionType: 'preprint',
    expressionDoi,
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
    publishedAt: new Date('1980'),
    server: O.some('biorxiv'),
  },
] as RNEA.ReadonlyNonEmptyArray<PaperExpression>));
