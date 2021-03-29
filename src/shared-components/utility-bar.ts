import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

const logInMenuItem = () => toHtmlFragment(`
  <li class="menu-page__nav_list_item">
    <a href="/log-in" class="menu-page__nav_list_link_button">Log in</a>
  </li>
`);

const logOutMenuItem = () => toHtmlFragment(`
  <li class="menu-page__nav_list_item">
    <a href="/log-out" class="menu-page__nav_list_link_button">Log out</a>
  </li>
`);

export const utilityBar = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="menu-page__nav" aria-describedby="application-utilities">
      <div id="application-utilities" hidden>Sciety application utilities</div>
      <ul class="menu-page__nav_list" role="list">
        <li class="menu-page__nav_list_item menu-page__nav_list_item--search">
          <a href="/search">
            <img src="/static/images/search-icon.svg" alt="Search" class="menu-page__nav_list__search_icon">
          </a>
        </li>
        ${O.fold(logInMenuItem, logOutMenuItem)(user)}
      </ul>
    </nav>
`);
