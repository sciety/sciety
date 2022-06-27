import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

import { User } from '../types/user';

const myProfileMenuItem = (user: User) => toHtmlFragment(`
  <li><a href="/users/${user.handle ?? user.id}" class="site-menu__link site-menu__link--profile"><span class="site-menu__link_text">My profile</span></a></li>
`);

const myFeedMenuItem = () => toHtmlFragment(`
  <li><a href="/my-feed" class="site-menu__link site-menu__link--feed"><span class="site-menu__link_text">My feed</span></a></li>
`);

export const siteMenuItems = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="site-menu__links">
    <li><a href="/" class="site-menu__link site-menu__link--home"><span class="site-menu__link_text">Home</span></a></li>
    <li><a href="/sciety-feed" class="site-menu__link site-menu__link--sciety-feed"><span class="site-menu__link_text">Sciety feed</span></a></li>
    ${O.fold(constant(''), myFeedMenuItem)(user)}
    ${O.fold(constant(''), myProfileMenuItem)(user)}
    <li><a href="/groups" class="site-menu__link site-menu__link--groups"><span class="site-menu__link_text">Groups</span></a></li>
  </ul>
`);
