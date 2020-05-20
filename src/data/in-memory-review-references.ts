import Doi from './doi';
import createLogger from '../logger';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (): ReviewReferenceRepository => {
  const log = createLogger('repository:in-memory-review-references');
  const reviewReferences: Array<ReviewReference & { added: Date }> = [];

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleVersionDoi: Doi, reviewDoi: Doi, editorialCommunityId: string, added: Date) => {
      const ref: ReviewReference & { added: Date } = {
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

    orderByAddedDescending: (limit: number) => reviewReferences.sort((a, b) => (
      b.added.getTime() - a.added.getTime()
    )).slice(0, limit),
  };
  return reviewReferenceRepository;
};
