import { pipe } from 'fp-ts/function';
import { renderAuthors } from './render-authors';
import { ArticleAuthors } from '../../types/article-authors';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ArticleDetails = {
  abstract: HtmlFragment,
  authors: ArticleAuthors,
};

export const renderAuthorsAndAbstractAndLink = (articleDetails: ArticleDetails): HtmlFragment => pipe(
  `
    <div class="article-authors-and-abstract-and-link">
      <section>
        ${renderAuthors(articleDetails.authors)}
      </section>

      <section role="doc-abstract">
        ${articleDetails.abstract}
      </section>
    </div>
  `,
  toHtmlFragment,
);
