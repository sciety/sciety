import { htmlEscape } from 'escape-goat';
import { UserDetails } from './user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderHeader = (ud: UserDetails): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--user">
    <img src="${ud.avatarUrl}" alt="" class="page-header__avatar">
    <h1>
      <span class="visually-hidden">Sciety user </span>${htmlEscape(ud.displayName)}
      <div class="page-header__handle">
        <span class="visually-hidden">Twitter handle </span>@${ud.handle}
      </div>
    </h1>
  </header>
`);
