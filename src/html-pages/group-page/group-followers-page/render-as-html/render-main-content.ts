import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { renderFollowers } from './render-followers';
import { ViewModel } from '../view-model';
import { tabList } from '../../common-components/tab-list';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 2,
});

const renderActiveTabContents = (viewmodel: ViewModel) => renderFollowers(viewmodel.activeTab);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
