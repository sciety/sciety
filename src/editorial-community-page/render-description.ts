import EditorialCommunityId from '../types/editorial-community-id';

export type RenderDescription = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type GetEditorialCommunityDescription = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => (
  async (editorialCommunityId) => {
    const editorialCommunityDescription = await getEditorialCommunityDescription(editorialCommunityId);
    return `
      <section class="ui basic vertical segment">
        ${editorialCommunityDescription}
      </section>
    `;
  }
);
