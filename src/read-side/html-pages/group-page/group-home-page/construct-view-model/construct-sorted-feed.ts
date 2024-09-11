import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../../../types/expression-doi';
import { GroupId } from '../../../../../types/group-id';

export const constructSortedFeed = (
  dependencies: Dependencies,
  groupId: GroupId,
): ReadonlyArray<ExpressionDoi> => pipe(
  dependencies.getPapersEvaluatedByGroup(groupId),
  (representatives) => Array.from(representatives),
);
