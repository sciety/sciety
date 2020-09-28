import { Result } from 'true-myth';
import templateDate from '../templates/date';
import Doi from '../types/doi';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
  publicationDate: Date;
}

export type GetArticleDetails = (doi: Doi) => Promise<Result<ArticleDetails, 'not-found'|'unavailable'>>;

export type RenderPageHeader = (doi: Doi) => Promise<Result<string, 'not-found'|'unavailable'>>;

export default (
  getArticleDetails: GetArticleDetails,
): RenderPageHeader => async (doi) => {
  const articleDetails = await getArticleDetails(doi);

  return articleDetails.map((details) => `
      <header class="article-header">
        <h1>${details.title}</h1>

        <ol aria-label="Authors of this article" class="article-author-list" role="list">
          ${details.authors.map((author) => `<li>${author}</li>`).join('')}
        </ol>

        <ul aria-label="Publication details" class="article-meta-data-list" role="list">
          <li>
            DOI <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li>
            Posted ${templateDate(details.publicationDate)}
          </li>
        </ul>
      </header>
    `);
};
