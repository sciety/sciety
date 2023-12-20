import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { ExternalQueries } from '../../third-parties';
import * as EDOI from '../../types/expression-doi';

export const searchForPaperExpressions: ExternalQueries['searchForPaperExpressions'] = () => () => TE.right({
  items: [
    EDOI.fromValidatedString('10.1101/2022.12.15.520598'),
    EDOI.fromValidatedString('10.1101/123457'),
  ],
  total: 2,
  nextCursor: O.none,
});
