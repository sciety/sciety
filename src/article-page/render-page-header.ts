import Doi from '../data/doi';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';

interface ArticleDetails {
  title: string;
  authors: Array<string>;
  publicationDate: Date;
}

export type GetArticleDetails = (doi: Doi) => Promise<ArticleDetails>;

export type RenderPageHeader = (doi: Doi) => Promise<string>;

export default (getArticleDetails: GetArticleDetails): RenderPageHeader => (
  async (doi) => {
    const articleDetails = await getArticleDetails(doi);

    let endorsements = '';

    if (doi.value === '10.1101/209320') {
      endorsements = `
        <div class="ui label">
          Endorsed by
          <span class="detail">PeerJ</span>
        </div>
      `;
    }

    return `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">${articleDetails.title}</h1>

        <ol aria-label="Authors of this article" class="ui comma separated horizontal list">
          ${templateListItems(articleDetails.authors)}
        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/${doi.value}">${doi.value}</a>
          </li>
          <li class="item">
            Posted ${templateDate(articleDetails.publicationDate)}
          </li>
        </ul>

        ${endorsements}
      </header>
    `;
  }
);
