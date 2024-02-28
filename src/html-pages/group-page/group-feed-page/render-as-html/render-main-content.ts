import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderListOfArticleCardsWithFallback } from './render-list-of-article-cards-with-fallback';
import { renderCollectionsSection } from './render-collections-section';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 0,
});

const augmentWithCollectionsSection = (otherContent: HtmlFragment) => toHtmlFragment(`
  ${renderCollectionsSection()}
  ${otherContent}
`);

const unmodified = (a: HtmlFragment) => a;

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfArticleCardsWithFallback(viewmodel.content),
  process.env.EXPERIMENT_ENABLED === 'true' ? augmentWithCollectionsSection : unmodified,
  renderTabs(tabProps(viewmodel)),
);
