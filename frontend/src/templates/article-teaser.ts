import { ReviewedArticle } from '../types/reviewed-article';
import templateDate from './date';
import templateListItems from './list-items';

export default (reviewedArticle: ReviewedArticle, articleLink: string): string => {
  const lastReview = reviewedArticle.reviews[reviewedArticle.reviews.length - 1];
  return `<article class="teaser">
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
            <li>
              ${reviewedArticle.reviews.length} reviews
            </li>

            <li>
              Reviewed ${templateDate(lastReview.publicationDate)} by ${lastReview.author}
            </li>
          </ul>
        </article>`;
};
