import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

const logInMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item">
    <a href="/log-in" class="utility-bar__list_link_button">Log In</a>
  </li>
`);

const logOutMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item">
    <a href="/log-out" class="utility-bar__list_link_button">Log Out</a>
  </li>
`);

const signUpMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item">
    <a href="/sign-up" class="utility-bar__list_link_sign_up_button">Sign Up</a>
  </li>
`);

export const utilityBar = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="utility-bar" aria-describedby="application-utilities">
    <div id="application-utilities" class="hidden">Sciety application utilities</div>
    <a href="/search" class="utility-bar__list__search_link">
      <img src="/static/images/search-icon.svg" alt="" class="utility-bar__list__search_icon"><span class="utility-bar__list__search_label">Search</span>
    </a>
    <ul class="utility-bar__list" role="list">
      ${O.fold(logInMenuItem, logOutMenuItem)(user)}
      ${O.fold(signUpMenuItem, constant(''))(user)}
    </ul>
  </nav>
`);
