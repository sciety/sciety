import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

import { User } from '../types/user';

const myProfileMenuItem = (user: User) => toHtmlFragment(`
  <li><a href="/users/${user.id}" class="site-menu__link site-menu__link--profile"><span>My profile</span></a></li>
`);

export const menuItems = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="site-menu__links">
    <li><a href="/" class="site-menu__link site-menu__link--home"><span>Home</span></a></li>
    <li><a href="/about" class="site-menu__link site-menu__link--about"><span>About</span></a></li>
    ${O.fold(constant(''), myProfileMenuItem)(user)}
  </ul>
`);
