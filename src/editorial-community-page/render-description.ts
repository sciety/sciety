import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderDescription = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => (
  async (editorialCommunityId) => {
    const editorialCommunityDescription = await getEditorialCommunityDescription(editorialCommunityId);
    return toHtmlFragment(`
      <section>
        ${editorialCommunityDescription}
      </section>
    `);
  }
);
