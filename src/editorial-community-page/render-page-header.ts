import { flow } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderPageHeader = (editorialCommunity: Community) => HtmlFragment;

type Community = {
  name: string,
  avatarPath: string,
};

const render = (editorialCommunity: Community): string => `
  <header class="page-header page-header--editorial-community">
    <img src="${editorialCommunity.avatarPath}" alt="" class="page-header__avatar">
    <h1 class="page-header__title">
      ${editorialCommunity.name}
    </h1>
  </header>
`;

export const renderPageHeader: RenderPageHeader = flow(
  render,
  toHtmlFragment,
);
