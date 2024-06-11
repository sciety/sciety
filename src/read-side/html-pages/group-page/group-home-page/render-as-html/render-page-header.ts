import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderFollowToggle } from './render-follow-toggle';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { PageHeaderViewModel } from '../view-model';

const renderPageHeaderIdentity = (group: PageHeaderViewModel['group']) => pipe(
  group.largeLogoPath,
  O.match(
    () => `<h1>${htmlEscape(group.name)}</h1>`,
    (largeLogoPath) => htmlEscape`
    <h1 class="page-header__visual_heading">
      <img src="${largeLogoPath}" alt="${group.name}" class="page-header__large_logo">
    </h1>
  `,
  ),
);

const renderAboutLink = (groupAboutPageHref: PageHeaderViewModel['groupAboutPageHref']) => `
    <a href="${groupAboutPageHref}" class="group-page-actions__secondary_button">About</a>
`;

const renderGroupListsLink = (groupListsPageHref: PageHeaderViewModel['groupListsPageHref']) => pipe(
  groupListsPageHref,
  O.match(
    () => '',
    (href) => `<a href="${href}" class="group-page-actions__secondary_button">Lists</a>`,
  ),
);

const renderGroupFollowersLink = (groupFollowersPageHref: PageHeaderViewModel['groupFollowersPageHref'], followerCount: PageHeaderViewModel['followerCount']) => `
  <a href="${groupFollowersPageHref}">
    <span class="visually-hidden">This group has ${followerCount} </span>Followers<span aria-hidden="true"> (${followerCount})</span>
  </a>
`;

export const renderPageHeader = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel.group)}
    </div>
    <p class="group-page-short-description">
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
    <div class="group-page-actions">
      ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
      ${renderAboutLink(viewmodel.groupAboutPageHref)}
      ${renderGroupListsLink(viewmodel.groupListsPageHref)}
      ${renderGroupFollowersLink(viewmodel.groupFollowersPageHref, viewmodel.followerCount)}
    </div>
  </header>
`);
