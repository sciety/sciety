import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import ReviewReference from './review-reference';

export default interface ReviewReferenceRepository extends Iterable<ReviewReference> {
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Promise<Array<ReviewReference>>;
  findReviewsForEditorialCommunityId(
    editorialCommunityId: EditorialCommunityId,
  ): Promise<Array<ReviewReference>>;
}
