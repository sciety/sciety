import renderReview from './render-review';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

export type GetArticleReviewSummaries = () => Promise<Array<{
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}>>;

export default (reviews: GetArticleReviewSummaries, id: string) => async (): Promise<string> => {
  const renderedReviews = (await reviews()).map((review, index) => (
    renderReview(review, `review-${index}`, 1500)
  ));
  if (renderedReviews.length === 0) {
    return '';
  }
  return `
    <section id="${id}">
      <h2 class="ui header">
        Reviews
      </h2>
      <ol class="ui very relaxed divided items">
        ${templateListItems(renderedReviews)}
      </ol>
    </section>
  `;
};
