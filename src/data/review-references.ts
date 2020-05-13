import Doi from './doi';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (): ReviewReferenceRepository => {
  const reviewReferences: Array<ReviewReference> = [];

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleVersionDoi: Doi, reviewDoi: Doi, editorialCommunityId: string, editorialCommunityName: string) => {
      reviewReferences.push({
        articleVersionDoi,
        reviewDoi,
        editorialCommunityId,
        editorialCommunityName,
      });
    },

    findReviewsForArticleVersionDoi: (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),
  };
  return reviewReferenceRepository;
};
