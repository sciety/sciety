import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<{
  name: string;
  avatar: URL;
}>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  (editorialCommunityId) => async () => {
    const editorialCommunity = await getEditorialCommunity(editorialCommunityId);

    return toHtmlFragment(`
      <header class="page-header page-header--editorial-community">
        <h1>
          <img src="${editorialCommunity.avatar.toString()}" alt="" class="ui avatar image">
          ${editorialCommunity.name}
        </h1>
      </header>
    `);
  }
);
