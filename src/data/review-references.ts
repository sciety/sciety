import Doi from './doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface ReviewReference {
  articleVersionDoi: Doi;
  reviewDoi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

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
