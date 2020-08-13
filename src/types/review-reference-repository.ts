import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { ReviewId } from './review-id';

export default interface ReviewReferenceRepository {
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Promise<Array<{
    reviewId: ReviewId;
    editorialCommunityId: EditorialCommunityId;
    added: Date;
  }>>;

  findReviewsForEditorialCommunityId(
    editorialCommunityId: EditorialCommunityId,
  ): Promise<Array<{
    articleVersionDoi: Doi;
    reviewId: ReviewId;
    added: Date;
  }>>;
}
