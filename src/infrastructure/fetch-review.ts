import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import Doi from '../types/doi';
import { Review } from '../types/review';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => Promise<{
  publicationDate: Date;
  summary?: string;
  url: URL;
}>;

export default (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
): FetchReview => (
  async (id: ReviewId): Promise<Review> => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }

    return fetchHypothesisAnnotation(id);
  }
);
