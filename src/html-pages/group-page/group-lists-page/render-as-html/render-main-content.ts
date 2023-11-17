import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs/index.js';
import { HtmlFragment } from '../../../../types/html-fragment.js';
import { tabList } from '../../common-components/tab-list.js';
import { ViewModel } from '../view-model.js';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback.js';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 1,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfListCardsWithFallback(viewmodel.listCards),
  renderTabs(tabProps(viewmodel)),
);
