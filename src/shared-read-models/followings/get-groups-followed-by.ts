import { ReadModel } from './handle-event';
import { GetGroupsFollowedBy } from '../../shared-ports';

export const getGroupsFollowedBy = (readmodel: ReadModel): GetGroupsFollowedBy => (userId) => (
  readmodel[userId] ?? []
);
