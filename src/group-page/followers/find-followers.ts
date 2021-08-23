import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  RA.reduce([], (state: ReadonlyArray<UserId>, event) => {
    if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
      return [...state, event.userId];
    }
    return state;
  }),
  RA.map((userId) => ({
    userId,
    followedGroupCount: 1,
    listCount: 1,
  })),
);
