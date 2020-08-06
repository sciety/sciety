import EditorialCommunityId from '../types/editorial-community-id';

export type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string;
  logo?: string;
}>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  async (editorialCommunityId) => {
    const editorialCommunity = await getEditorialCommunity(editorialCommunityId);
    let h1: string;
    if (editorialCommunity.logo !== undefined) {
      h1 = `<img src="${editorialCommunity.logo}" alt="${editorialCommunity.name}" class="ui image">`;
    } else {
      h1 = editorialCommunity.name;
    }
    return `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">
          ${h1}
        </h1>
      </header>
    `;
  }
);
