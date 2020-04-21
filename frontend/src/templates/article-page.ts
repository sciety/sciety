import templateDate from './date';
import templateListItems from './list-items';
import { Article } from './types/article';

export default (article: Article): string => (
  `<article>
    <header>

      <ol>
        <li aria-label="Article category">
          ${article.category}
        </li>
        <li aria-label="Article type">
          ${article.type}
        </li>
      </ol>

      <h1>
        ${article.title}
      </h1>

      <ol aria-label="Authors of this article" class="author-list">
        ${templateListItems(article.authors)}
      </ol>

      <ul aria-label="Publication details">
        <li>
          DOI: <a href="https://doi.org/${article.doi}">${article.doi}</a>
        </li>
        <li>
          Posted ${templateDate(article.publicationDate)}
        </li>
      </ul>

    </header>
  </article>`
);
