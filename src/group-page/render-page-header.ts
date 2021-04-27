import { htmlEscape } from 'escape-goat';
import { flow } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';

type Group = {
  name: string,
  avatarPath: string,
};

const render = (group: Group) => `
  <header class="page-header page-header--group">
    <img src="${group.avatarPath}" alt="" class="page-header__avatar">
    <h1 class="page-header__title">
      ${htmlEscape(group.name)}
    </h1>
  </header>
`;

export const renderPageHeader = flow(
  render,
  toHtmlFragment,
);
