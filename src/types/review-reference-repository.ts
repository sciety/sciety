import ReviewReference from './review-reference';
import Doi from '../data/doi';

export default interface ReviewReferenceRepository {
  add(
    articleVersionDoi: Doi,
    reviewDoi: Doi,
    editorialCommunityId: string,
    editorialCommunityName: string,
  ): void;
  findReviewsForArticleVersionDoi(
    articleVersionDoi: Doi,
  ): Array<ReviewReference>;
}
