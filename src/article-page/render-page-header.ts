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
      <header>
        <h1 class="ui header">${articleDetails.title}</h1>

        <ol aria-label="Authors of this article" class="ui horizontal list">
          ${templateListItems(
    articleDetails.authors.map((author: string) => (`
              <div class="content">${author}</div>
            `)),
  )}
        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li class="item">
            Posted ${templateDate(articleDetails.publicationDate)}
          </li>
        </ul>
      </header>
    `;
  }
);
