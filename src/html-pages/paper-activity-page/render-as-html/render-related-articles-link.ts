import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { PaperActivitySummaryCardViewModel } from '../../../shared-components/paper-activity-summary-card/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';

export const renderRelatedArticlesLink = (
  relatedArticles: O.Option<ReadonlyArray<PaperActivitySummaryCardViewModel>>,
): HtmlFragment => pipe(
  relatedArticles,
  O.match(
    () => '',
    () => `
      <a href="#relatedArticles" class="see-related-articles-button">See related articles</a>
    `,
  ),
  toHtmlFragment,
);
