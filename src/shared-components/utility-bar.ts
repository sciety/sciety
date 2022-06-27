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

const myFeedMenuItem = () => toHtmlFragment(`
  <li class="utility-bar__list_item utility-bar__list_item--wide-only">
    <a href="/my-feed" class="utility-bar__list_nav_link">My feed</a>
  </li>
`);

const myProfileMenuItem = (user: User) => toHtmlFragment(`
  <li class="utility-bar__list_item utility-bar__list_item--wide-only">
    <a href="/users/${user.handle ?? user.id}" class="utility-bar__list_nav_link">My profile</a>
  </li>
`);

export const utilityBar = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="utility-bar" aria-describedby="application-utilities">
    <div id="application-utilities" class="hidden">Sciety application utilities</div>
    <ul class="utility-bar__list" role="list">
      <li class="utility-bar__list_item utility-bar__list_item--wide-only">
        <a href="/" class="utility-bar__list_nav_link">Home</a>
      </li>
      <li class="utility-bar__list_item utility-bar__list_item--wide-only">
        <a href="/groups" class="utility-bar__list_nav_link">Groups</a>
      </li>
      ${O.fold(constant(''), myFeedMenuItem)(user)}
      ${O.fold(constant(''), myProfileMenuItem)(user)}
      ${O.fold(logInMenuItem, logOutMenuItem)(user)}
      ${O.fold(signUpMenuItem, constant(''))(user)}
    </ul>
  </nav>
`);
