import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { renderTweetThis } from './render-tweet-this';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

interface ArticleDetails {
  title: SanitisedHtmlFragment;
  authors: Array<string>;
}

export type GetArticleDetails<E> = (doi: Doi) => T.Task<Result<ArticleDetails, E>>;

export type RenderPageHeader<E> = (doi: Doi) => T.Task<Result<HtmlFragment, E>>;

const render = (doi: Doi) => (details: ArticleDetails): HtmlFragment => toHtmlFragment(`
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
    ${renderTweetThis(doi)}
  </header>
`);

export default <E>(
  getArticleDetails: GetArticleDetails<E>,
): RenderPageHeader<E> => (doi) => (
  pipe(
    doi,
    getArticleDetails,
    T.map((article) => article.map(render(doi))),
  )
);
