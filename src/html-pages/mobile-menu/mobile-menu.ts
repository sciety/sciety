import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

export const mobileMenu = (user: O.Option<UserDetails>): HtmlFragment => pipe(
  user,
  O.match(
    () => ({
      myProfileLink: '',
      userMenuLinks: `
      <li><a href="/subscribe-to-mailing-list" class="mobile-menu__link">Newsletter</a></li>
      <li><a href="/about" class="mobile-menu__link">About</a></li>
      <li>
        <a href="/log-in" class="mobile-menu__link mobile-menu__link_primary_button">Log In</a>
      </li>
      <li>
        <a href="/sign-up" class="mobile-menu__link mobile-menu__link_sign_up_button">Sign Up</a>
      </li>
    `,
    }),
    (loggedInUser) => ({
      myProfileLink: `<li class="mobile-menu__link">
      <a href="/users/${loggedInUser.handle}" >
        <img src="${loggedInUser.avatarUrl}" alt="">
        <span>${loggedInUser.handle}</span>
      </a>
    </li>`,
      userMenuLinks: `
      <li><a href="/my-feed" class="mobile-menu__link">My Feed</a></li>
      <li><a href="/users/${loggedInUser.handle}" class="mobile-menu__link">My Lists</a></li>
      <li>
        <a href="/log-out" class="mobile-menu__link mobile-menu__link_primary_button">Log Out</a>
      </li>
    `,
    }),
  ),
  (userMenu) => `
    <div class="mobile-menu" id="mobileNavigation">
      <ul role="list" class="mobile-menu__links">
        ${userMenu.myProfileLink}
        <li><a href="/" class="mobile-menu__link">Home</a></li>
        <li><a href="/groups" class="mobile-menu__link">Groups</a></li>
        <li><a href="/lists" class="mobile-menu__link">Lists</a></li>
        ${userMenu.userMenuLinks}
        <li><a href="#siteHeader" class="mobile-menu__link mobile-menu__back_link">Back</a></li>
      </ul>
    </div>
`,
  toHtmlFragment,
);
