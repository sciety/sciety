import { GetFollowedEditorialCommunities } from './render-page';
import EditorialCommunityId from '../types/editorial-community-id';

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string,
  avatarUrl: string,
}>;

const list = [
  new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
];

export default (getEditorialCommunity: GetEditorialCommunity): GetFollowedEditorialCommunities => (
  async () => Promise.all(list.map(async (editorialCommunityId) => ({
    id: editorialCommunityId,
    ...await getEditorialCommunity(editorialCommunityId),
  })))
);
