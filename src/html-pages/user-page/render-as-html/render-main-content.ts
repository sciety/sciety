import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import { ListCardViewModel, renderListCard } from '../../../shared-components/list-card/render-list-card';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { FollowingTab, ListsTab, ViewModel } from '../view-model';
import { tabList } from './tab-list';
import { followingNothing, informationUnavailable } from './static-messages';
import { renderGroupCard } from '../../../shared-components/group-card';
import { renderFollowList } from './render-follow-list';
import { templateListItems } from '../../../shared-components/list-items';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.userDetails.handle, viewmodel.listCount, viewmodel.groupIds.length),
  activeTabIndex: viewmodel.activeTab.selector === 'lists' ? 0 : 1,
});

const renderFollowedGroups = (viewmodel: FollowingTab) => pipe(
  viewmodel.followedGroups,
  O.map(RA.match(
    () => followingNothing,
    flow(
      RA.map(renderGroupCard),
      renderFollowList,
    ),
  )),
  O.match(
    () => informationUnavailable,
    identity,
  ),
);

const createNewListCallToAction = `
  <form action="/forms/create-list" method="post">
    <button class="create-new-list-call-to-action">Create new list</button>
  </form>
`;

const renderCallToAction = (activeTab: ListsTab) => (activeTab.showCreateNewList ? createNewListCallToAction : '');

const renderMultipleListCards = (cardViewModels: ReadonlyArray<ListCardViewModel>) => pipe(
  cardViewModels,
  RA.map(renderListCard),
  (renderedCards) => templateListItems(renderedCards, 'owned-lists-list__item'),
  (templatedItems) => `
    <ul class="card-list" role="list">
      ${templatedItems}
    </ul>
  `,
);

const renderLists = (activeTab: ListsTab) => toHtmlFragment(`
  <div>
    ${renderCallToAction(activeTab)}
    ${renderMultipleListCards(activeTab.ownedLists)}
  </div>
`);

const renderActiveTabContents = (viewmodel: ViewModel) => (
  (viewmodel.activeTab.selector === 'lists')
    ? renderLists(viewmodel.activeTab)
    : renderFollowedGroups(viewmodel.activeTab)
);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
