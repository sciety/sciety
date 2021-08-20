import { Follower } from './augment-with-user-details';
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { toUserId } from '../../types/user-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = () => () => (
  process.env.EXPERIMENT_ENABLED === 'true' ? [{
    userId: toUserId('1295307136415735808'),
    listCount: 1,
    followedGroupCount: 13,
  }] : []
);
