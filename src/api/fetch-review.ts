import { FetchDataciteReview } from './fetch-datacite-review';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import Doi from '../data/doi';
import { Review } from '../types/review';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => Promise<{
  publicationDate: Date;
  summary: string;
  url: URL;
}>;

export default (
  fetchDataciteReview: FetchDataciteReview,
): FetchReview => {
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation();
  return async (id: ReviewId): Promise<Review> => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }

    return fetchHypothesisAnnotation(id);
  };
};
