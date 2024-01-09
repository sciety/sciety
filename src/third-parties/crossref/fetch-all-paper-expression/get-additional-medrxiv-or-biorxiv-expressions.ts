import * as TE from 'fp-ts/TaskEither';
import * as DE from '../../../types/data-error';
import { PaperExpression } from '../../../types/paper-expression';

export const getAdditionalMedrxivOrBiorxivExpressions = (
  expression: PaperExpression,
): TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>> => TE.right([expression]);
