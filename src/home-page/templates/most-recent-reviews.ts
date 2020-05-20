import Doi from '../../data/doi';
import { toDisplayString } from '../../templates/date';
import templateListItems from '../../templates/list-items';

interface Review {
  articleDoi: Doi;
  articleTitle: string;
  editorialCommunityName: string;
  added: Date;
}

const templateReview = (review: Review): string => (`
 <a href="/articles/${review.articleDoi}">${review.articleTitle}</a> added by ${review.editorialCommunityName} <span title="${toDisplayString(review.added)}">recently</span>
`);

export default (reviews: Array<Review>): string => (`
  <section>

    <h2>
      Most recent reviews
    </h2>

    <ol>
      ${templateListItems(reviews.map(templateReview))}
    </ol>

  </section>
`);
