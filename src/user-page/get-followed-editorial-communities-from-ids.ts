import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { GetFollowedEditorialCommunities } from './render-follow-list';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetFollowedEditorialCommunityIds = (userId: UserId) => T.Task<ReadonlyArray<EditorialCommunityId>>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<{
  id: EditorialCommunityId,
  name: string,
  avatarPath: string,
}>;

export const createGetFollowedEditorialCommunitiesFromIds = (
  getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds,
  getEditorialCommunity: GetEditorialCommunity,
): GetFollowedEditorialCommunities => (userId) => (
  pipe(
    userId,
    getFollowedEditorialCommunityIds,
    T.chain(T.traverseArray(getEditorialCommunity)),
  )
);
