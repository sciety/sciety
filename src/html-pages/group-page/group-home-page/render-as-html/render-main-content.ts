import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListOfArticleCardsWithFallback } from './render-list-of-article-cards-with-fallback';
import { renderFeaturedListsSection } from './render-featured-lists-section';

const augmentWithFeaturedListsSection = (viewmodel: ViewModel) => (otherContent: HtmlFragment) => pipe(
  viewmodel.featuredLists,
  RA.match(
    () => otherContent,
    (listCards) => toHtmlFragment(`
        ${renderFeaturedListsSection(listCards)}
        ${otherContent}
      `),
  ),
);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfArticleCardsWithFallback(viewmodel.content),
  augmentWithFeaturedListsSection(viewmodel),
);
