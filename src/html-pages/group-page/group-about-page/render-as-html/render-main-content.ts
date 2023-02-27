import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { tabList } from './tab-list';
import { renderAboutTab } from './render-about-tab';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel),
  activeTabIndex: 1,
});

const renderActiveTabContents = (viewmodel: ViewModel) => renderAboutTab(viewmodel.activeTab);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
