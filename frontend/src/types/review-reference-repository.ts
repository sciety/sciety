import ReviewReference from './review-reference';
import Doi from '../data/doi';

export default interface ReviewReferenceRepository {
  add(reviewReference: ReviewReference): void;

  findReviewDoisForArticleDoi(articleDoi: Doi): Array<string>;
}
