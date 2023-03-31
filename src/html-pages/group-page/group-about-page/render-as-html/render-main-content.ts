import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderAboutTab } from './render-about-tab';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 1,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderAboutTab(viewmodel.activeTab),
  renderTabs(tabProps(viewmodel)),
);
