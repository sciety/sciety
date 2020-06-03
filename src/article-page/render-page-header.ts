import Doi from '../data/doi';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
  publicationDate: Date;
}

export type GetArticleDetails = (doi: Doi) => Promise<ArticleDetails>;

type RenderPageHeader = (doi: Doi) => Promise<string>;

export default (getArticleDetails: GetArticleDetails): RenderPageHeader => (
  async (doi) => {
    const articleDetails = await getArticleDetails(doi);
    return `
      <header class="content-header">
        <h1>${articleDetails.title}</h1>

        <ol aria-label="Authors of this article" class="author-list">
          ${templateListItems(articleDetails.authors)}
        </ol>

        <ul aria-label="Publication details" class="content-header__details">
          <li>
            DOI: <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li>
            Posted ${templateDate(articleDetails.publicationDate)}
          </li>
        </ul>
      </header>
    `;
  }
);
