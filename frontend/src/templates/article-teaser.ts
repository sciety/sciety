import templateListItems from './list-items';
import { ReviewedArticle } from '../types/reviewed-article';

export default (reviewedArticle: ReviewedArticle, articleLink: string): string => (
  `<article class="teaser">
    <ol aria-label="Article categories" class="teaser__categories">
      <li>${reviewedArticle.article.category}</li>
    </ol>

    <h3 class="teaser__title">
      <a href="${articleLink}">${reviewedArticle.article.title}</a>
    </h3>

    <ol aria-label="Authors of this article" class="author-list">
      ${templateListItems(reviewedArticle.article.authors)}
    </ol>

    <ul aria-label="Review details" class="teaser__details">
      ${reviewedArticle.reviews.length} reviews
    </ul>
  </article>`
);
