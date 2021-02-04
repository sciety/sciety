import { flow } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPageHeader = (editorialCommunity: Community) => HtmlFragment;

type Community = {
  name: string,
  avatarPath: string,
};

const render = (editorialCommunity: Community): string => `
  <header class="page-header page-header--editorial-community">
    <h1>
      <img src="${editorialCommunity.avatarPath}" alt="" class="ui avatar image">
      ${editorialCommunity.name}
    </h1>
  </header>
`;

export const renderPageHeader: RenderPageHeader = flow(
  render,
  toHtmlFragment,
);
