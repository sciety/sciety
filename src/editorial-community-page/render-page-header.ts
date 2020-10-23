import { URL } from 'url';
import EditorialCommunityId from '../types/editorial-community-id';

export type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string;
  avatar: URL;
}>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  async (editorialCommunityId) => {
    const editorialCommunity = await getEditorialCommunity(editorialCommunityId);

    return `
      <header class="page-header page-header--editorial-community">
        <h1>
          <img src="${editorialCommunity.avatar.toString()}" alt="" class="ui avatar image">
          ${editorialCommunity.name}
        </h1>
      </header>
    `;
  }
);
