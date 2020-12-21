import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

type Community = {
  name: string;
  avatar: URL;
};

export type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Community>;

const render = (editorialCommunity: Community): string => `
  <header class="page-header page-header--editorial-community">
    <h1>
      <img src="${editorialCommunity.avatar.toString()}" alt="" class="ui avatar image">
      ${editorialCommunity.name}
    </h1>
  </header>
`;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => flow(
  getEditorialCommunity,
  T.map(render),
  T.map(toHtmlFragment),
);
