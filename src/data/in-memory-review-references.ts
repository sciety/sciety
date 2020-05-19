import Doi from './doi';
import createLogger from '../logger';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (): ReviewReferenceRepository => {
  const log = createLogger('repository:in-memory-review-references');
  const reviewReferences: Array<ReviewReference> = [];

  const reviewReferenceRepository: ReviewReferenceRepository = {
    add: (articleVersionDoi: Doi, reviewDoi: Doi, editorialCommunityId: string) => {
      const ref: ReviewReference = {
        articleVersionDoi,
        reviewDoi,
        editorialCommunityId,
      };
      reviewReferences.push(ref);
      log(`Review reference added: ${JSON.stringify(ref)}`);
    },

    findReviewsForArticleVersionDoi: (articleVersionDoi) => (
      reviewReferences
        .filter((reference) => reference.articleVersionDoi.value === articleVersionDoi.value)
    ),

    findReviewsForEditorialCommunityId: (editorialCommunityId) => (
      reviewReferences
        .filter((reference) => reference.editorialCommunityId === editorialCommunityId)
    ),

    orderByAddedDescending: () => {
      const mostRecentReviewReferences: Array<ReviewReference> = [
        {
          articleVersionDoi: new Doi('10.1101/642017'),
          reviewDoi: new Doi('10.5281/zenodo.3833746'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
        {
          articleVersionDoi: new Doi('10.1101/615682'),
          reviewDoi: new Doi('10.5281/zenodo.3833918'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
        {
          articleVersionDoi: new Doi('10.1101/629618'),
          reviewDoi: new Doi('10.5281/zenodo.3833917'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
        {
          articleVersionDoi: new Doi('10.1101/252593'),
          reviewDoi: new Doi('10.5281/zenodo.3833893'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
        {
          articleVersionDoi: new Doi('10.1101/600445'),
          reviewDoi: new Doi('10.5281/zenodo.3833915'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
      ];
      return mostRecentReviewReferences;
    },
  };
  return reviewReferenceRepository;
};
