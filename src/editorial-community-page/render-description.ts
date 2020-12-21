import * as T from 'fp-ts/lib/Task';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderDescription = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => (
  (editorialCommunityId) => async () => {
    const editorialCommunityDescription = await getEditorialCommunityDescription(editorialCommunityId);
    return toHtmlFragment(`
      <section>
        ${editorialCommunityDescription}
      </section>
    `);
  }
);
