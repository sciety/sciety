import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import { FollowList } from '../types/follow-list';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

export type CommitEvents = (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => T.Task<void>;
export type GetFollowList = (userId: UserId) => T.Task<FollowList>;

type FollowCommand = (user: User, editorialCommunityId: GroupId) => T.Task<void>;

export const followCommand = (
  getFollowList: GetFollowList,
  commitEvents: CommitEvents,
): FollowCommand => (
  (user, editorialCommunityId) => pipe(
    user.id,
    getFollowList,
    T.map((followList) => followList.follow(editorialCommunityId)),
    T.chain(commitEvents),
  )
);
