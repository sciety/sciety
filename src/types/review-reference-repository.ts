import ReviewReference from './review-reference';
import Doi from '../data/doi';

export default interface ReviewReferenceRepository extends Iterable<ReviewReference> {
  add(
    articleVersionDoi: Doi,
    reviewDoi: Doi,
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
