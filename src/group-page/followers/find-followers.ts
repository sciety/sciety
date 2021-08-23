import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  RA.filter(isUserFollowedEditorialCommunityEvent),
  RA.filter(({ editorialCommunityId }) => editorialCommunityId === groupId),
  RA.map((event) => ({
    userId: event.userId,
    followedGroupCount: 1,
    listCount: 1,
  })),
);
