import { htmlEscape } from 'escape-goat';
import { flow } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';

type Group = {
  name: string,
  avatarPath: string,
  shortDescription: string,
};

const render = (group: Group) => `
  <header class="page-header page-header--group">
    <div class="page-header__identity">
      <img src="${group.avatarPath}" alt="" class="page-header__avatar">
      <h1>
        ${htmlEscape(group.name)}
      </h1>
    </div>
    <p>
      ${htmlEscape(group.shortDescription)}
    </p>
  </header>
`;

export const renderPageHeader = flow(
  render,
  toHtmlFragment,
);
