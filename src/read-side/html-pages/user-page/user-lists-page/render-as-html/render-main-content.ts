import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { tabList } from './tab-list';
import { pathToSubmitCreateList } from '../../../../../http/form-submission-handlers/submit-paths';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../shared-components/list-card';
import { renderListItems } from '../../../shared-components/list-items';
import { renderListOfCards } from '../../../shared-components/list-of-cards';
import { renderTabs } from '../../../shared-components/tabs';
import { ListsTab, ViewModel } from '../view-model';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.userDetails.handle, viewmodel.listCount, viewmodel.groupIds.length),
  activeTabIndex: 0,
});

const createNewListCallToAction = `
  <form action="${pathToSubmitCreateList()}" method="post">
    <button class="create-new-list-call-to-action">Create new list</button>
  </form>
`;

const renderCallToAction = (activeTab: ListsTab) => (activeTab.showCreateNewList ? createNewListCallToAction : '');

const renderMultipleListCards = (cardViewModels: ReadonlyArray<ListCardViewModel>) => pipe(
  cardViewModels,
  RA.map(renderListCard),
  renderListItems,
  renderListOfCards,
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
