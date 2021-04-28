import { DomainEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

type FollowedGroups = (events: ReadonlyArray<DomainEvent>) => (userId: UserId) => ReadonlyArray<GroupId>;

// ts-unused-exports:disable-next-line
export const followedGroups: FollowedGroups = () => () => [];
