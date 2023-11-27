import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel } from '../../../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderRelatedArticlesLink = (
  relatedArticles: O.Option<ReadonlyArray<ArticleCardViewModel>>,
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
