import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { tabList } from './tab-list';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel),
  activeTabIndex: viewmodel.activeTabIndex,
});

const renderActiveTabContents = (viewmodel: ViewModel) => viewmodel.activeTabContent;

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
