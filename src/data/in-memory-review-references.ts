import Doi from './doi';
import createLogger from '../logger';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (): ReviewReferenceRepository => {
  const log = createLogger('repository:in-memory-review-references');
  const reviewReferences: Array<ReviewReference> = [];

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleVersionDoi: Doi, reviewDoi: Doi, editorialCommunityId: string, added: Date) => {
      const ref: ReviewReference = {
        articleVersionDoi,
        reviewDoi,
        editorialCommunityId,
        added,
      };
      reviewReferences.push(ref);
      log(`Review reference added: ${JSON.stringify(ref)}`);
    },

    [Symbol.iterator]: () => (
      reviewReferences[Symbol.iterator]()
    ),

    findReviewsForArticleVersionDoi: (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),

    findReviewsForEditorialCommunityId: (editorialCommunityId) => (
      reviewReferences
        .filter((reference) => reference.editorialCommunityId === editorialCommunityId)
    ),
  };
  return reviewReferenceRepository;
};
