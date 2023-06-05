import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

export const siteMenuItems = (user: O.Option<UserDetails>): HtmlFragment => pipe(
  user,
  O.match(
    () => `
      <li><a href="/subscribe-to-mailing-list" class="site-menu__link"><span class="site-menu__link_text">Newsletter</span></a></li>
      <li><a href="/about" class="site-menu__link"><span class="site-menu__link_text">About</span></a></li>
      <li>
        <a href="/log-in" class="site-menu__link utility-bar__list_link_button">Log In</a>
      </li>
    `,
    (loggedInUser) => `
      <li><a href="/my-feed" class="site-menu__link"><span class="site-menu__link_text">My Feed</span></a></li>
      <li><a href="/users/${loggedInUser.handle}" class="site-menu__link"><span class="site-menu__link_text">My Lists</span></a></li>
    `,
  ),
  (userMenu) => `
    <ul role="list" class="site-menu__links">
      <li><a href="/" class="site-menu__link"><span class="site-menu__link_text">Home</span></a></li>
      <li><a href="/groups" class="site-menu__link"><span class="site-menu__link_text">Groups</span></a></li>
      <li><a href="/lists" class="site-menu__link"><span class="site-menu__link_text">Lists</span></a></li>
      ${userMenu}
    </ul>
  `,
  toHtmlFragment,
);
