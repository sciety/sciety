import templateListItems from './list-items';
import { ArticleTeaser } from '../types/article-teaser';

export default (articleTeaser: ArticleTeaser): string => (
  `<article class="teaser">
    <h3 class="teaser__title">
      <a href="${articleTeaser.link}">${articleTeaser.title}</a>
    </h3>

    <ol aria-label="Authors of this article" class="author-list">
      ${templateListItems(articleTeaser.authors)}
    </ol>

    <ul aria-label="Review details" class="teaser__details">
      ${articleTeaser.numberOfReviews} reviews
    </ul>
  </article>`
);
