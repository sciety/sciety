import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderListOfArticleCardsWithFallback } from './render-list-of-article-cards-with-fallback';
import { renderFeaturedListsSection } from './render-featured-lists-section';
import { wrapperForTopSpace } from '../../common-components/wrapper-for-top-space';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 0,
});

const augmentWithCollectionsSection = (viewmodel: ViewModel) => (otherContent: HtmlFragment) => pipe(
  viewmodel.featuredLists,
  RA.match(
    () => otherContent,
    (collectionCards) => toHtmlFragment(`
        ${renderFeaturedListsSection(collectionCards)}
        ${otherContent}
      `),
  ),
);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfArticleCardsWithFallback(viewmodel.content),
  augmentWithCollectionsSection(viewmodel),
  wrapperForTopSpace,
  renderTabs(tabProps(viewmodel)),
);
