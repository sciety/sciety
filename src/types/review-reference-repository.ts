import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import ReviewReference from './review-reference';

export default interface ReviewReferenceRepository {
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Promise<Array<ReviewReference>>;
  findReviewsForEditorialCommunityId(
    editorialCommunityId: EditorialCommunityId,
  ): Promise<Array<ReviewReference>>;
}
