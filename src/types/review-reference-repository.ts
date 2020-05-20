import ReviewReference from './review-reference';
import Doi from '../data/doi';

export default interface ReviewReferenceRepository extends Iterable<ReviewReference> {
  add(
    articleVersionDoi: Doi,
    reviewDoi: Doi,
    editorialCommunityId: string,
    added: Date,
  ): void;
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Array<ReviewReference>;
  findReviewsForEditorialCommunityId(
    editorialCommunityId: string,
  ): Array<ReviewReference>;
}
