import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { ReviewId } from './review-id';
import ReviewReference from './review-reference';

export default interface ReviewReferenceRepository extends Iterable<ReviewReference> {
  add(
    articleVersionDoi: Doi,
    reviewId: ReviewId,
    editorialCommunityId: EditorialCommunityId,
    added: Date,
  ): Promise<void>;
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Promise<Array<ReviewReference>>;
  findReviewsForEditorialCommunityId(
    editorialCommunityId: EditorialCommunityId,
  ): Promise<Array<ReviewReference>>;
}
