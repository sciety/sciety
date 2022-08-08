import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

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

const logInMenuItem = () => `
  <li class="utility-bar__list_item">
    <a href="/log-in" class="utility-bar__list_link_button">Log In</a>
  </li>
`;

const logOutMenuItem = () => `
  <li class="utility-bar__list_item">
    <a href="/log-out" class="utility-bar__list_link_button">Log Out</a>
  </li>
`;

const signUpMenuItem = () => `
  <li class="utility-bar__list_item">
    <a href="/sign-up" class="utility-bar__list_link_sign_up_button">Sign Up</a>
  </li>
`;

const myFeedMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/my-feed" class="utility-bar__list_nav_link">My Feed</a>
  </li>
`;

const myProfileMenuItem = (user: User) => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/users/${user.handle ?? user.id}" class="utility-bar__list_nav_link">My Profile</a>
  </li>
`;

const scietyFeedMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/sciety-feed" class="utility-bar__list_nav_link">Sciety Feed</a>
  </li>
`;

const aboutScietyMenuItem = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/about" class="utility-bar__list_nav_link">About Sciety</a>
  </li>
`;

const username = () => `
  <li class="utility-bar__list_item utility-bar__list_item--navigation">
    <a href="/about" class="utility-bar__list_nav_link" style="display: flex; align-items: center; gap: 6px">
    <img src="https://pbs.twimg.com/profile_images/1417079202973638657/VrQKBTkw_bigger.jpg" class="user-list-card__avatar">
    MMMMMMMMMMMMMMM
    </a>
  </li>
`;


const loggedOutMenuItems = () => `
  ${homeMenuItem()}
  ${groupsMenuItem()}
  ${scietyFeedMenuItem()}
  ${aboutScietyMenuItem()}
  ${logInMenuItem()}
  ${signUpMenuItem()}
`;

const loggedInMenuItems = (user: User) => `
  ${homeMenuItem()}
  ${groupsMenuItem()}
  ${myFeedMenuItem()}
  ${myProfileMenuItem(user)}
  ${username()}
  ${logOutMenuItem()}
`;

export const utilityBar = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <nav class="utility-bar" aria-describedby="application-utilities">
    <div id="application-utilities" class="hidden">Sciety application utilities</div>
    <ul class="utility-bar__list" role="list">
      ${O.fold(loggedOutMenuItems, loggedInMenuItems)(user)}
    </ul>
  </nav>
`);
