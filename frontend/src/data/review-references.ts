import Doi from './doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface ReviewReference {
  articleDoi: Doi;
  reviewDoi: string;
}

export default (): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = [];
  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleDoi: Doi, reviewDoi: string) => {
      reviewReferences.push({
        articleDoi,
        reviewDoi,
      });
    },

    findReviewDoisForArticleDoi: (articleDoi) => (
      reviewReferences
        .filter((reference) => reference.articleDoi.value === articleDoi.value)
        .map((reference) => reference.reviewDoi)
    ),
  };
  return reviewReferenceRepository;
};
