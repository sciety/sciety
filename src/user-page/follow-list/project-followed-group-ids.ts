import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectFollowedCommunities = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
      result.add(event.editorialCommunityId.value);
    } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
      result.delete(event.editorialCommunityId.value);
    }
  });
  return pipe(
    [...result],
    RA.map((id) => new GroupId(id)),
  );
};

type ProjectFollowedGroupIds = (userId: UserId) => T.Task<ReadonlyArray<GroupId>>;

export const projectFollowedGroupIds = (
  getAllEvents: GetAllEvents,
): ProjectFollowedGroupIds => (userId) => pipe(
  getAllEvents,
  T.map(projectFollowedCommunities(userId)),
);
