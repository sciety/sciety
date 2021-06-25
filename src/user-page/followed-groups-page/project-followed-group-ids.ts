import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
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

type FollowedGroupIds = (userId: UserId) => TE.TaskEither<'not-following-groups', RNEA.ReadonlyNonEmptyArray<Gid.GroupId>>;

export const followedGroupIds = (
  getAllEvents: GetAllEvents,
): FollowedGroupIds => (userId) => pipe(
  getAllEvents,
  T.map(calculateFollowedGroups(userId)),
  T.map(RNEA.fromReadonlyArray),
  T.map(E.fromOption(() => 'not-following-groups' as const)),
);
