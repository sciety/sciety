import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { identity, pipe } from 'fp-ts/function';
import { ReadModel, RecordedEvaluation } from './handle-event';
import { GroupId } from '../../types/group-id';

export type GetEvaluationsByGroup = (groupId: GroupId) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsByGroup = (readmodel: ReadModel): GetEvaluationsByGroup => (groupId) => pipe(
  readmodel.byGroupId,
  R.lookup(groupId),
  O.match(
    () => [],
    identity,
  ),
);
