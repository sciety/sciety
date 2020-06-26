import Doi from './doi';
import { ReviewId } from './review-id';
import ReviewReference from './review-reference';

export default interface ReviewReferenceRepository extends Iterable<ReviewReference> {
  add(
    articleVersionDoi: Doi,
    reviewId: ReviewId,
    editorialCommunityId: string,
    added: Date,
  ): Promise<void>;
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Promise<Array<ReviewReference>>;
  findReviewsForEditorialCommunityId(
    editorialCommunityId: string,
  ): Promise<Array<ReviewReference>>;
}
