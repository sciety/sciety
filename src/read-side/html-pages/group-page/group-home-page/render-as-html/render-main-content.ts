import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderFeaturedListsSection } from './render-featured-lists-section';
import { renderGroupFeed } from './render-group-feed';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../view-model';

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
  renderGroupFeed(viewmodel.feed),
  augmentWithFeaturedListsSection(viewmodel),
);
