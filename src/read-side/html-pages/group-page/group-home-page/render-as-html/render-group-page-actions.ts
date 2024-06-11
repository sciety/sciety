import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderFollowToggle } from './render-follow-toggle';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { PageHeaderViewModel } from '../view-model';

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

const renderManagementLink = () => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return '';
  }
  return '<a href="#">Manage this group</a>';
};

export const renderGroupPageActions = (viewmodel: PageHeaderViewModel): HtmlFragment => toHtmlFragment(`
  <div class="group-page-actions">
    ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
    ${renderAboutLink(viewmodel.groupAboutPageHref)}
    ${renderGroupListsLink(viewmodel.groupListsPageHref)}
    ${renderGroupFollowersLink(viewmodel.groupFollowersPageHref, viewmodel.followerCount)}
    ${renderManagementLink()}
  </div>
`);
