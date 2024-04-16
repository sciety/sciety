import * as O from 'fp-ts/Option';
import { constructUserAvatarSrc } from '../../read-side/paths';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';
import { UserHandle } from '../../types/user-handle';
import { ColourSchemes } from '../colour-schemes';

const homeMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation" aria-hidden="true">
    <a href="/" class="utility-bar__list_nav_link">Home</a>
  </li>
`;

const groupsMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/groups" class="utility-bar__list_nav_link">Groups</a>
  </li>
`;

const listsMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/lists" class="utility-bar__list_nav_link">Lists</a>
  </li>
`;

const logInMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/log-in" class="utility-bar__list_link_primary_button">Log In</a>
  </li>
`;

const logOutMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/log-out" class="utility-bar__list_link_secondary_button">Log Out</a>
  </li>
`;

const signUpMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/sign-up" class="utility-bar__list_link_secondary_button">Sign Up</a>
  </li>
`;

const myFeedMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/my-feed" class="utility-bar__list_nav_link">My Feed</a>
  </li>
`;

const myListsMenuItem = (handle: UserHandle) => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/users/${handle}/lists" class="utility-bar__list_nav_link">My Lists</a>
  </li>
`;

const myUsernameMenuItem = (handle: UserHandle, avatarSrc: string) => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/users/${handle}" class="utility-bar-user-profile">
      <img src="${avatarSrc}" alt="" class="utility-bar-user-profile__avatar">
      <span class="utility-bar-user-profile__handle">${handle}</span>
    </a>
  </li>
`;

const newsletterMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/subscribe-to-mailing-list" class="utility-bar__list_nav_link">Newsletter</a>
  </li>
`;

const aboutScietyMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/about" class="utility-bar__list_nav_link">About</a>
  </li>
`;

const loggedOutMenuItems = () => `
  ${homeMenuItem()}
  ${groupsMenuItem()}
  ${listsMenuItem()}
  ${newsletterMenuItem()}
  ${aboutScietyMenuItem()}
  ${logInMenuItem()}
  ${signUpMenuItem()}
`;

const loggedInMenuItems = (user: UserDetails) => `
  ${homeMenuItem()}
  ${groupsMenuItem()}
  ${listsMenuItem()}
  ${myFeedMenuItem()}
  ${myListsMenuItem(user.handle)}
  ${myUsernameMenuItem(user.handle, constructUserAvatarSrc(user))}
  ${logOutMenuItem()}
`;

export const utilityBar = (user: O.Option<UserDetails>, scheme: ColourSchemes = 'light'): HtmlFragment => toHtmlFragment(`
  <nav class="utility-bar${scheme === 'dark' ? ' utility-bar--dark' : ''}" aria-describedby="application-settings">
    <div id="application-settings" style="display: none;">Sciety application settings</div>
    <ul class="utility-bar__list" role="list">
      ${O.match(loggedOutMenuItems, loggedInMenuItems)(user)}
    </ul>
  </nav>
`);
