import ReviewReference from './review-reference';

export default interface ReviewReferenceRepository {
  add(reviewReference: ReviewReference): void;

  findReviewDoisForArticleDoi(articleDoi: string): Array<string>;
}
