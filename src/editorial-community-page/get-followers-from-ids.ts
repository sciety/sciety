import * as O from 'fp-ts/lib/Option';
import { Result } from 'true-myth';
import { GetFollowers } from './render-followers';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export type UserDetails = {
  handle: string;
  displayName: string;
  avatarUrl: string;
};

export type GetUserDetails = (userId: UserId) => Promise<Result<UserDetails, unknown>>;

type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

export default (
  getFollowerIds: GetFollowerIds,
  getUserDetails: GetUserDetails,
): GetFollowers<O.Option<FollowerDetails>> => (
  async (editorialCommunityId) => {
    const userIds = await getFollowerIds(editorialCommunityId);
    return Promise.all(userIds.map(async (userId) => (
      (await getUserDetails(userId))
        .map((userDetails) => ({
          ...userDetails,
          userId,
        }))
        .mapOr(O.none, (u) => O.some(u))
    )));
  }
);
