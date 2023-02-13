import { ReadModel } from './handle-event';
import { GetGroupsFollowedBy } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export const getGroupsFollowedBy = (readmodel: ReadModel): GetGroupsFollowedBy => (userId) => (
  readmodel[userId] ?? []
);
