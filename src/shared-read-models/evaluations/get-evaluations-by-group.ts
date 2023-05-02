import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

export type GetEvaluationsByGroup = (groupId: GroupId) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsByGroup = (readmodel: ReadModel): GetEvaluationsByGroup => (groupId) => pipe(
  readmodel.byGroupId.get(groupId),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
