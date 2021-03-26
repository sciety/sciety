import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

import { User } from '../types/user';

const myProfileMenuItem = (user: User) => toHtmlFragment(`
  <li>
    <a href="/users/${user.id}" class="flyout-menu__link">My profile</a>
  </li>
`);

export const menuItems = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="flyout-menu__links">
    <li><a href="/" class="flyout-menu__link flyout-menu__link--home"><span>Home</span></a></li>
    <li><a href="/about" class="flyout-menu__link flyout-menu__link--about"><span>About</span></a></li>
    ${O.fold(constant(''), myProfileMenuItem)(user)}
  </ul>
`);
