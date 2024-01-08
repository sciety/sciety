import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { PaperExpression } from '../../types/paper-expression';
import { ExternalQueries } from '../../third-parties';

export const findAllExpressionsOfPaper: ExternalQueries['findAllExpressionsOfPaper'] = (expressionDoi) => T.of(O.some([
  {
    expressionDoi,
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
    publishedAt: new Date('1970'),
  },
  {
    expressionDoi,
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
    publishedAt: new Date('1980'),
  },
] as RNEA.ReadonlyNonEmptyArray<PaperExpression>));
