import Doi from './doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface ReviewReference {
  articleVersionDoi: Doi;
  reviewDoi: Doi;
}

export default (): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = [];
  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleVersionDoi: Doi, reviewDoi: Doi) => {
      reviewReferences.push({
        articleVersionDoi,
        reviewDoi,
      });
    },

    findReviewDoisForArticleVersionDoi: (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
        .map((reference) => reference.reviewDoi)
    ),
  };
  return reviewReferenceRepository;
};
