import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';

interface Review {
  articleDoi: Doi;
  articleTitle: string;
  editorialCommunityName: string;
}

const templateReview = (review: Review): string => (`
 <a href="/articles/${review.articleDoi}">${review.articleTitle}</a> added by ${review.editorialCommunityName} just now
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
