import templateDate from './date';
import templateListItems from './list-items';
import { ReviewedArticle } from '../types/reviewed-article';

export default (reviewedArticle: ReviewedArticle): string => (
  `<header class="content-header">

      <ol class="content-header__categories">
        <li aria-label="Article category">
          ${reviewedArticle.article.category}
        </li>
        <li aria-label="Article type">
          ${reviewedArticle.article.type}
        </li>
      </ol>

      <h1>
        ${reviewedArticle.article.title}
      </h1>

      <ol aria-label="Authors of this article" class="author-list">
        ${templateListItems(reviewedArticle.article.authors)}
      </ol>

      <ul aria-label="Publication details" class="content-header__details">
        <li>
          DOI: <a href="https://doi.org/${reviewedArticle.article.doi}">${reviewedArticle.article.doi}</a>
        </li>
        <li>
          Posted ${templateDate(reviewedArticle.article.publicationDate)}
        </li>
      </ul>

    </header>`
);
