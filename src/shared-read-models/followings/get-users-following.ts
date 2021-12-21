import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type GetUsersFollowing = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<UserId>;

export const getUsersFollowing: GetUsersFollowing = (groupId) => (events) => pipe(
  events,
  RA.reduce([], (state: ReadonlyArray<UserId>, event: DomainEvent) => {
    if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
      return [...state, event.userId];
    }
    if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
      return state.filter((userId) => userId !== event.userId);
    }
    return state;
  }),
);
