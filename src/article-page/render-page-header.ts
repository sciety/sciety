import { Result } from 'true-myth';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
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
      <header class="ui basic padded vertical segment">
        <h1>${details.title}</h1>

        <ol aria-label="Authors of this article" class="ui comma separated horizontal list" role="list">
          ${templateListItems(details.authors)}
        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li class="item">
            Posted ${templateDate(details.publicationDate)}
          </li>
        </ul>
      </header>
    `);
};
