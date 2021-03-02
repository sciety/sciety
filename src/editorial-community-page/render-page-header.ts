import { flow } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';

type Community = {
  name: string,
  avatarPath: string,
};

const render = (editorialCommunity: Community) => `
  <header class="page-header page-header--group">
    <img src="${editorialCommunity.avatarPath}" alt="" class="page-header__avatar">
    <h1 class="page-header__title">
      ${editorialCommunity.name}
    </h1>
  </header>
`;

export const renderPageHeader = flow(
  render,
  toHtmlFragment,
);
