import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListCardViewModel, renderListCard } from '../../../../shared-components/list-card/index.js';
import { renderTabs } from '../../../../shared-components/tabs/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';
import { ListsTab, ViewModel } from '../view-model.js';
import { tabList } from './tab-list.js';
import { renderListItems } from '../../../../shared-components/render-list-items.js';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.userDetails.handle, viewmodel.listCount, viewmodel.groupIds.length),
  activeTabIndex: 0,
});

const createNewListCallToAction = `
  <form action="/forms/create-list" method="post">
    <button class="create-new-list-call-to-action">Create new list</button>
  </form>
`;

const renderCallToAction = (activeTab: ListsTab) => (activeTab.showCreateNewList ? createNewListCallToAction : '');

const renderMultipleListCards = (cardViewModels: ReadonlyArray<ListCardViewModel>) => pipe(
  cardViewModels,
  RA.map(renderListCard),
  (renderedCards) => renderListItems(renderedCards),
  (templatedItems) => `
    <ol class="card-list" role="list">
      ${templatedItems}
    </ol>
  `,
);

const renderLists = (activeTab: ListsTab) => toHtmlFragment(`
  <div>
    ${renderCallToAction(activeTab)}
    ${renderMultipleListCards(activeTab.ownedLists)}
  </div>
`);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderLists(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
