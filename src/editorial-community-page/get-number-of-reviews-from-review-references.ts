import { GetNumberOfReviews } from './render-reviews';
import ReviewReference from '../types/review-reference';

type FindReviewReferences = (editorialCommunityId: string) => Promise<ReadonlyArray<ReviewReference>>;

export default (
  findReviewReferences: FindReviewReferences,
): GetNumberOfReviews => (
  async (editorialCommunityId) => (
    (await findReviewReferences(editorialCommunityId)).length
  )
);
