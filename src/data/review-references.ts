import Doi from './doi';
import editorialCommunities from './editorial-communities';
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
    add: (articleVersionDoi: Doi, reviewDoi: Doi) => {
      reviewReferences.push({
        articleVersionDoi,
        reviewDoi,
        editorialCommunityId: editorialCommunities[0].id,
        editorialCommunityName: editorialCommunities[0].name,
      });
    },

    findReviewsForArticleVersionDoi: (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),
  };
  return reviewReferenceRepository;
};
