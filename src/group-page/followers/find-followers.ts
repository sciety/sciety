import { Follower } from './augment-with-user-details';
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = () => () => (
  []
);
