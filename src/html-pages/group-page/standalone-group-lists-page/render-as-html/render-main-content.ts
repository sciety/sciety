import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { wrapperForTopSpace } from '../../common-components/wrapper-for-top-space';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 1,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfListCardsWithFallback(viewmodel.listCards),
  wrapperForTopSpace,
  renderTabs(tabProps(viewmodel)),
);
