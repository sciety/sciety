import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type GetEvaluationsByGroup = (groupId: GroupId) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsByGroup = (readmodel: ReadModel): GetEvaluationsByGroup => (groupId) => pipe(
  readmodel.byGroupId.get(groupId),
  O.fromNullable,
  O.match(
    () => [],
    (state) => Array.from(state.values()),
  ),
);
