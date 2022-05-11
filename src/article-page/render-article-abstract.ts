import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ArticleDetails = {
  abstract: HtmlFragment,
  authors: ArticleAuthors,
};

export const renderArticleAbstract = (articleDetails: ArticleDetails): HtmlFragment => pipe(
  `
    <section role="doc-abstract" class="article-abstract">
      ${articleDetails.abstract}
    </section>
  `,
  toHtmlFragment,
);
