import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { RenderEditorialCommunity } from './render-editorial-community';
import templateListItems from '../shared-components/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type GetAllEditorialCommunities = T.Task<Array<{
  avatar: URL;
  id: EditorialCommunityId;
  name: string;
}>>;

export default (
  editorialCommunities: GetAllEditorialCommunities,
  renderEditorialCommunity: RenderEditorialCommunity,
): RenderEditorialCommunities => (userId) => async () => {
  const editorialCommunityLinks = await Promise.all(
    (await editorialCommunities())
      .map(async (editorialCommunity) => renderEditorialCommunity(userId, editorialCommunity)()),
  );

  return toHtmlFragment(`
    <section>
      <h2>
        Editorial communities
      </h2>
      <ol class="editorial-community-list" role="list">
        ${templateListItems(editorialCommunityLinks, 'editorial-community-list__item')}
      </ol>
    </section>
  `);
};
