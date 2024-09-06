import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export const getPapersEvaluatedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<ExpressionDoi> => pipe(
  readModel.paperSnapshotRepresentatives,
  R.lookup(groupId),
  O.map((representatives) => Array.from(representatives)),
  O.getOrElseW(() => []),
);
