import Doi from '../data/doi';
import { article3Review1 } from '../data/review-dois';

interface Article {
  title: string;
  doi: Doi;
  publicationDate: Date;
  abstract: string;
  authors: Array<string>;
}

export default (article: Article): string => (
  `<form method="post" action="/reviews" class="compact-form">
    <input type="hidden" name="articleversiondoi" value="${article.doi}">
    <label for="reviewdoi">DOI of the review</label>
    <div class="compact-form__row">
      <input type="text" name="reviewdoi" id="reviewdoi" placeholder="${article3Review1}" class="compact-form__article-doi" required>
      <button type="submit" class="compact-form__submit">
        <span class="visually-hidden">Add review</span>
      </button>
    </div>
  </form>`
);
