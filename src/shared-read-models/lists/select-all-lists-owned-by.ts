import * as O from 'fp-ts/Option';
import { createListFromEvaluationEvents } from './create-list-from-evaluation-events';
import { GroupId } from '../../types/group-id';

type List = {
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  ownerId: GroupId,
};

type ReadModel = Map<GroupId, List>;

export const selectAllListsOwnedBy = (groupId: GroupId) => (readModel: ReadModel): List => (
  readModel.get(groupId) ?? createListFromEvaluationEvents(groupId, [])
);
