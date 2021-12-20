import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent, UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent,
} from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type FollowOrUnfollowEvent = UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent;

const reduceFollowOrUnfollowEventToGroupIds = (
  state: ReadonlyArray<GroupId>,
  event: FollowOrUnfollowEvent,
): ReadonlyArray<GroupId> => pipe(
  event.editorialCommunityId,
  (groupId) => {
    switch (event.type) {
      case 'UserFollowedEditorialCommunity':
        return [...state, groupId];
      case 'UserUnfollowedEditorialCommunity':
        return pipe(
          state,
          RA.filter((existing) => existing !== groupId),
        );
    }
  },
);

const isFollowOrUnfollowEventForUser = (userId: UserId) => (event: DomainEvent): event is FollowOrUnfollowEvent => (
  (
    isUserFollowedEditorialCommunityEvent(event) || isUserUnfollowedEditorialCommunityEvent(event)
  )
  && event.userId === userId
);

type FollowedGroups = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<GroupId>;

export const followedGroups: FollowedGroups = (userId) => (events) => pipe(
  events,
  RA.filter(isFollowOrUnfollowEventForUser(userId)),
  RA.reduce(RA.empty, reduceFollowOrUnfollowEventToGroupIds),
);
