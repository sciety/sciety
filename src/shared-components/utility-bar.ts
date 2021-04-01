import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

const logInMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item">
    <a href="/log-in" class="utility-bar__list_link_button">Log in</a>
  </li>
`);

const logOutMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item">
    <a href="/log-out" class="utility-bar__list_link_button">Log out</a>
  </li>
`);

export const utilityBar = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="utility-bar" aria-describedby="application-utilities">
      <div id="application-utilities" hidden>Sciety application utilities</div>
      <ul class="utility-bar__list" role="list">
        <li class="utility-bar__list_item utility-bar__list_item--search">
          <a href="/search">
            <img src="/static/images/search-icon.svg" alt="Search" class="utility-bar__list__search_icon">
          </a>
        </li>
        ${O.fold(logInMenuItem, logOutMenuItem)(user)}
      </ul>
    </nav>
`);
