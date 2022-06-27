import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

import { User } from '../types/user';

const myProfileMenuItem = (user: User) => toHtmlFragment(`
  <li><a href="/users/${user.handle ?? user.id}" class="site-menu__link site-menu__link--profile"><span class="site-menu__link_text">My profile</span></a></li>
`);

export const drawerNavItems = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="site-menu__links">
    <li><a href="/sciety-feed" class="site-menu__link site-menu__link--sciety-feed"><span class="site-menu__link_text">Sciety feed</span></a></li>
    ${O.fold(constant(''), myProfileMenuItem)(user)}
  </ul>
`);
