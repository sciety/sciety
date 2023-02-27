import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { renderFollowers } from './render-followers';
import { ViewModel } from '../view-model';
import { tabList } from './tab-list';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { renderAboutTab } from './render-about-tab';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel),
  activeTabIndex: 2,
});

const renderActiveTabContents = (viewmodel: ViewModel) => {
  switch (viewmodel.activeTab.selector) {
    case 'lists':
      return renderListOfListCardsWithFallback(viewmodel.activeTab.lists);
    case 'about':
      return renderAboutTab(viewmodel.activeTab);
    default:
      return renderFollowers(viewmodel.activeTab);
  }
};

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
