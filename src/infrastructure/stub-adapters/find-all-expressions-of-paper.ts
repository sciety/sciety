import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as EDOI from '../../types/expression-doi';
import { PaperExpression } from '../../types/paper-expression';
import { ExternalQueries } from '../../third-parties';

export const findAllExpressionsOfPaper: ExternalQueries['findAllExpressionsOfPaper'] = () => T.of(O.some([
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2022.08.20.504530'),
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
    publishedAt: new Date('1970'),
    version: 1,
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2022.08.20.504530'),
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
    publishedAt: new Date('1980'),
    version: 2,
  },
] as RNEA.ReadonlyNonEmptyArray<PaperExpression>));
