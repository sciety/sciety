import { Result } from 'true-myth';
import { RenderReviewedEvent, Review } from './render-reviewed-event';
import Doi from '../types/doi';

type RenderFeed = (doi: Doi) => Promise<Result<string, 'no-content'>>;

export type GetReviews = (doi: Doi) => Promise<ReadonlyArray<Review>>;

export default (
  getReviews: GetReviews,
  renderReviewedEvent: RenderReviewedEvent,
): RenderFeed => async (doi) => {
  const reviews = await getReviews(doi);

  if (reviews.length === 0) {
    return Result.err('no-content');
  }

  const items = reviews.map(renderReviewedEvent).join('\n');

  return Result.ok(`
    <section>
      <h2>Feed</h2>

      <ol role="list" class="article-feed">
        ${items}
      </ol>
    </section>
  `);
};
