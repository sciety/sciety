import Doi from '../../data/doi';
import templateDate from '../../templates/date';
import templateListItems from '../../templates/list-items';

export interface ArticlePageHeader {
  title: string;
  authors: Array<string>;
  doi: Doi;
  publicationDate: Date;
}

export default (article: ArticlePageHeader): string => (
  `<header class="content-header">

      <h1>
        ${article.title}
      </h1>

      <ol aria-label="Authors of this article" class="author-list">
        ${templateListItems(article.authors)}
      </ol>

      <ul aria-label="Publication details" class="content-header__details">
        <li>
          DOI: <a href="https://doi.org/${article.doi}">${article.doi}</a>
        </li>
        <li>
          Posted ${templateDate(article.publicationDate)}
        </li>
      </ul>

    </header>`
);
