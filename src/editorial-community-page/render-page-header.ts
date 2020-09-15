import EditorialCommunityId from '../types/editorial-community-id';

export type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string;
  avatarUrl: string;
}>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  async (editorialCommunityId) => {
    const editorialCommunity = await getEditorialCommunity(editorialCommunityId);

    return `
      <header class="ui basic padded vertical segment">
        <h1>
          <img src="${editorialCommunity.avatarUrl}" alt="" class="ui avatar image">
          ${editorialCommunity.name}
        </h1>
      </header>
    `;
  }
);
