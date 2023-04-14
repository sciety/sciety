import * as O from 'fp-ts/Option';
import { constant } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

const myProfileMenuItem = (user: UserDetails) => toHtmlFragment(`
  <li><a href="/users/${user.handle}" class="site-menu__link"><span class="site-menu__link_text">My Lists</span></a></li>
`);

const myFeedMenuItem = () => toHtmlFragment(`
  <li><a href="/my-feed" class="site-menu__link"><span class="site-menu__link_text">My Feed</span></a></li>
`);

export const siteMenuItems = (user: O.Option<UserDetails>): HtmlFragment => toHtmlFragment(`
  <ul role="list" class="site-menu__links">
    <li><a href="/" class="site-menu__link"><span class="site-menu__link_text">Home</span></a></li>
    <li><a href="/lists" class="site-menu__link"><span class="site-menu__link_text">Lists</span></a></li>
    <li><a href="/sciety-feed" class="site-menu__link"><span class="site-menu__link_text">Sciety Feed</span></a></li>
    ${O.fold(constant(''), myFeedMenuItem)(user)}
    ${O.fold(constant(''), myProfileMenuItem)(user)}
    <li><a href="/groups" class="site-menu__link"><span class="site-menu__link_text">Groups</span></a></li>
  </ul>
`);
