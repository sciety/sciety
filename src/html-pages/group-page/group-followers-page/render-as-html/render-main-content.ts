import { flow, pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel, UserCardViewModel } from '../view-model';
import { tabList } from '../../common-components/tab-list';

const renderListCount = (count: number) => (
  `${count} list${count === 1 ? '' : 's'}`
);

const renderUserCard = (userCard: UserCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="user-card">
    <div class="user-card__body">
      <h3 class="user-card__title"><a href="${userCard.link}" class="user-card__link">${userCard.title}</a></h3>
      <div class="user-card__handle">@${userCard.handle}</div>
      <span class="user-card__meta"><span class="visually-hidden">This user has </span><span>${renderListCount(userCard.listCount)}</span><span>${userCard.followedGroupCount} groups followed</span></span>
    </div>
    <img class="user-card__avatar" src="${userCard.avatarUrl}" alt="">
  </article>
`);

const renderFollowersList = (userCards: ReadonlyArray<UserCardViewModel>) => pipe(
  userCards,
  RA.map(flow(
    renderUserCard,
    (userCard) => `<li class="group-page-followers-list__item">${userCard}</li>`,
  )),
  (items) => (items.length === 0 ? '' : `
    <ul class="group-page-followers-list">
      ${items.join('')}
    </ul>
  `),
);

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 2,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  `
    <p>
      ${viewmodel.activeTab.followerCount} ${viewmodel.activeTab.followerCount === 1 ? 'user is' : 'users are'} following this group.
    </p>
    ${renderFollowersList(viewmodel.activeTab.followers)}
    ${viewmodel.activeTab.nextLink}
  `,
  toHtmlFragment,
  renderTabs(tabProps(viewmodel)),
);
