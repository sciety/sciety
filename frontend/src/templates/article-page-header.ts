import templateDate from './date';
import templateListItems from './list-items';
import { Article } from '../types/article';

export default (article: Article): string => (
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
