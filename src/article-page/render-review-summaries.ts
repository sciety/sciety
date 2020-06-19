import renderReviewSummary from './render-review-summary';
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
  const reviewSummaries = (await reviews()).map((review, index) => (
    renderReviewSummary(review, `review-${index}`, 1500)
  ));
  if (reviewSummaries.length === 0) {
    return '';
  }
  return `
    <section id="${id}">
      <h2 class="ui header">
        Reviews
      </h2>
      <ol class="ui very relaxed divided items">
        ${templateListItems(reviewSummaries)}
      </ol>
    </section>
  `;
};
