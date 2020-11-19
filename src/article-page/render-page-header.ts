import { Result } from 'true-myth';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
}

export type GetArticleDetails<E> = (doi: Doi) => Promise<Result<ArticleDetails, E>>;

export type RenderPageHeader<E> = (doi: Doi) => Promise<Result<HtmlFragment, E>>;

export default <E>(
  getArticleDetails: GetArticleDetails<E>,
): RenderPageHeader<E> => async (doi) => {
  const articleDetails = await getArticleDetails(doi);

  return articleDetails.map((details) => toHtmlFragment(`
    <header class="page-header page-header--article">
      <h1>${details.title}</h1>

      <ol aria-label="Authors of this article" class="article-author-list" role="list">
        ${details.authors.map((author) => `<li>${author}</li>`).join('')}
      </ol>

      <ul aria-label="Publication details" class="article-meta-data-list" role="list">
        <li>
          <a href="https://doi.org/${doi.value}">https://doi.org/${doi.value}</a>
        </li>
      </ul>
    </header>
  `));
};
