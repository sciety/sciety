import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { FetchNcrcReview } from './fetch-ncrc-review';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => TE.TaskEither<'unavailable' | 'not-found', {
  fullText: HtmlFragment,
  url: URL,
}>;

export const fetchReview = (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
  fetchNcrcReview: FetchNcrcReview,
): FetchReview => (
  (id) => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }

    if (id instanceof HypothesisAnnotationId) {
      return fetchHypothesisAnnotation(id.value);
    }

    return fetchNcrcReview(id.value);
  }
);
