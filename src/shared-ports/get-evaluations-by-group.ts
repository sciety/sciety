import { GroupId } from '../types/group-id';
import { RecordedEvaluation } from '../types/recorded-evaluation';

export type GetEvaluationsByGroup = (groupId: GroupId) => ReadonlyArray<RecordedEvaluation>;
