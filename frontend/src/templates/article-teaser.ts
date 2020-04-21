import { Article } from './types/article';
import templateDate from './date';
import templateListItems from './list-items';

export default (article: Article, articleLink: string): string => {
  const lastReview = article.reviews[article.reviews.length - 1];
  return `<article class="teaser">
          <ol aria-label="Article categories" class="teaser__categories">
            <li>${article.category}</li>
          </ol>

          <h3 class="teaser__title">
            <a href="${articleLink}">${article.title}</a>
          </h3>

          <ol aria-label="Authors of this article" class="author-list">
            ${templateListItems(article.authors)}
          </ol>

          <ul aria-label="Review details" class="teaser__details">
            <li>
              ${article.reviews.length} reviews
            </li>

            <li>
              Reviewed ${templateDate(lastReview.publicationDate)} by ${lastReview.author}
            </li>
          </ul>
        </article>`;
};
