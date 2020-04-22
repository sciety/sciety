import templateDate from './date';
import templateListItems from './list-items';
import { ReviewedArticle } from '../types/reviewed-article';

export default (reviewedArticle: ReviewedArticle): string => (
  `<header class="content-header">

      <ol class="content-header__categories">
        <li aria-label="Article category">
          ${reviewedArticle.category}
        </li>
        <li aria-label="Article type">
          ${reviewedArticle.type}
        </li>
      </ol>

      <h1>
        ${reviewedArticle.title}
      </h1>

      <ol aria-label="Authors of this article" class="author-list">
        ${templateListItems(reviewedArticle.authors)}
      </ol>

      <ul aria-label="Publication details" class="content-header__details">
        <li>
          DOI: <a href="https://doi.org/${reviewedArticle.doi}">${reviewedArticle.doi}</a>
        </li>
        <li>
          Posted ${templateDate(reviewedArticle.publicationDate)}
        </li>
      </ul>

    </header>`
);
