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
    <li><a href="/groups" class="site-menu__link site-menu__link--groups"><span class="site-menu__link_text">Groups</span></a></li>
    <li><a href="/blog" class="site-menu__link site-menu__link--blog"><span class="site-menu__link_text">Blog</span></a></li>
    <li><a href="/about" class="site-menu__link site-menu__link--about"><span class="site-menu__link_text">About</span></a></li>
    ${O.fold(constant(''), myFeedMenuItem)(user)}
    ${O.fold(constant(''), myProfileMenuItem)(user)}
    <li><a href="/contact-us" class="site-menu__link site-menu__link--contact-us"><span class="site-menu__link_text">Contact us</span></a></li>
  </ul>
`);

export const siteMenuFooter = toHtmlFragment(`
  <footer class="site-menu__footer">
    <small class="site-menu__small_print">
      © 2021 eLife Sciences Publications Ltd.
      <a href="/legal">Legal information</a>
    </small>
  </footer>
`);
