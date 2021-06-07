import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../types/domain-events';
import * as Gid from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const calculateFollowedGroups = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
      result.add(event.editorialCommunityId);
    } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
      result.delete(event.editorialCommunityId);
    }
  });
  return pipe(
    [...result],
    RA.map((id) => Gid.fromValidatedString(id)), // TODO: we already have the GroupId in the event
  );
};

type ProjectFollowedGroupIds = (userId: UserId) => T.Task<ReadonlyArray<Gid.GroupId>>;

export const projectFollowedGroupIds = (
  getAllEvents: GetAllEvents,
): ProjectFollowedGroupIds => (userId) => pipe(
  getAllEvents,
  T.map(calculateFollowedGroups(userId)),
);
