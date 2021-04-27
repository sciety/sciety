import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

export const renderHeader = (ud: UserDetails): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--user">
    <img src="${ud.avatarUrl}" alt="" class="page-header__avatar">
    <h1>
      ${htmlEscape(ud.displayName)}
      <div class="page-header__handle">
        @${ud.handle}
      </div>
    </h1>
  </header>
`);
