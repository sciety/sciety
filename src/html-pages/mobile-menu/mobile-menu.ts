import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructUserAvatarSrc } from '../../read-side/paths';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

const renderProfileLink = (user: O.Option<UserDetails>) => pipe(
  user,
  O.match(
    () => '',
    (loggedInUser) => `
      <li>
      <a href="/users/${loggedInUser.handle}" class="mobile-menu__link mobile-menu__link--user-profile">
        <img src="${constructUserAvatarSrc(loggedInUser)}" alt="" class="mobile-menu__user_avatar">
        <span><span class="visually-hidden">Currently logged in as </span>${loggedInUser.handle}</span>
      </a>
    </li>`,
  ),
);

const renderUserMenuLinks = (user: O.Option<UserDetails>) => pipe(
  user,
  O.match(
    () => `
      <li><a href="/subscribe-to-mailing-list" class="mobile-menu__link">Newsletter</a></li>
      <li><a href="/about" class="mobile-menu__link">About</a></li>
      <li>
        <a href="/log-in" class="mobile-menu__link mobile-menu__link_primary_button">Log In</a>
      </li>
      <li>
        <a href="/sign-up" class="mobile-menu__link mobile-menu__link_secondary_button">Sign Up</a>
      </li>
    `,
    (loggedInUser) => `
      <li><a href="/my-feed" class="mobile-menu__link">My Feed</a></li>
      <li><a href="/users/${loggedInUser.handle}" class="mobile-menu__link">My Lists</a></li>
      <li>
        <a href="/log-out" class="mobile-menu__link mobile-menu__link_secondary_button">Log Out</a>
      </li>
    `,
  ),
);

export const mobileMenu = (user: O.Option<UserDetails>): HtmlFragment => pipe(
  `
    <nav class="mobile-menu" id="mobileNavigation">
      <span class="visually-hidden">Site navigation links</span>
      <ul role="list" class="mobile-menu__links">
        ${renderProfileLink(user)}
        <li><a href="/" class="mobile-menu__link">Home</a></li>
        <li><a href="/groups" class="mobile-menu__link">Groups</a></li>
        <li><a href="/lists" class="mobile-menu__link">Lists</a></li>
        ${renderUserMenuLinks(user)}
      </ul>
      <a href="#mobileMenuReturnPoint"><img src="/static/images/close-icon.svg" alt="dismiss this menu" class="mobile-menu__close_link"></a>
    </nav>
`,
  toHtmlFragment,
);
