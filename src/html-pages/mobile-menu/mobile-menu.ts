import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

export const mobileMenu = (user: O.Option<UserDetails>): HtmlFragment => pipe(
  user,
  O.match(
    () => `
      <li><a href="/subscribe-to-mailing-list" class="mobile-menu__link"><span class="mobile-menu__link_text">Newsletter</span></a></li>
      <li><a href="/about" class="mobile-menu__link"><span class="mobile-menu__link_text">About</span></a></li>
      <li>
        <a href="/log-in" class="mobile-menu__link mobile-menu__link_primary_button">Log In</a>
      </li>
      <li>
        <a href="/sign-up" class="mobile-menu__link mobile-menu__link_sign_up_button">Sign Up</a>
      </li>
    `,
    (loggedInUser) => `
      <li><a href="/my-feed" class="mobile-menu__link"><span class="mobile-menu__link_text">My Feed</span></a></li>
      <li><a href="/users/${loggedInUser.handle}" class="mobile-menu__link"><span class="mobile-menu__link_text">My Lists</span></a></li>
      <li>
        <a href="/log-out" class="mobile-menu__link mobile-menu__link_primary_button">Log Out</a>
      </li>
    `,
  ),
  (userMenu) => `
    <div class="mobile-menu" id="mobileNavigation">
      <ul role="list" class="mobile-menu__links">
        <li><a href="/" class="mobile-menu__link"><span class="mobile-menu__link_text">Home</span></a></li>
        <li><a href="/groups" class="mobile-menu__link"><span class="mobile-menu__link_text">Groups</span></a></li>
        <li><a href="/lists" class="mobile-menu__link"><span class="mobile-menu__link_text">Lists</span></a></li>
        ${userMenu}
        <li><a href="#siteHeader" class="mobile-menu__link"><span class="mobile-menu__link_text mobile-menu__back_link">Back</span></a></li>
      </ul>
    </div>
`,
  toHtmlFragment,
);
