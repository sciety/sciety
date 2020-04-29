import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = [];
  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (reviewReference) => {
      reviewReferences.push(reviewReference);
    },

    findReviewDoisForArticleDoi: (articleDoi) => (
      reviewReferences
        .filter((reference) => reference.articleDoi === articleDoi)
        .map((reference) => reference.reviewDoi)
    ),
  };
  return reviewReferenceRepository;
};
