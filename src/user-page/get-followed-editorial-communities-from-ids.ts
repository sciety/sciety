import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { GetFollowedEditorialCommunities } from './render-follow-list';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetFollowedEditorialCommunityIds = (userId: UserId) => T.Task<ReadonlyArray<EditorialCommunityId>>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<{
  name: string,
  avatar: URL,
}>;

export const createGetFollowedEditorialCommunitiesFromIds = (
  getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds,
  getEditorialCommunity: GetEditorialCommunity,
): GetFollowedEditorialCommunities => (userId) => (
  pipe(
    userId,
    getFollowedEditorialCommunityIds,
    T.chain(T.traverseArray((editorialCommunityId) => pipe(
      editorialCommunityId,
      getEditorialCommunity,
      T.map((det) => ({
        id: editorialCommunityId,
        ...det,
      })),
    ))),
  )
);
