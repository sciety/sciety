import createFetchReviews, { FetchReview } from '../../src/article-page/fetch-reviews';
import createEditorialCommunityRepository from '../../src/infrastructure/in-memory-editorial-communities';
import createReviewReferenceRepository from '../../src/infrastructure/in-memory-review-references';
import Doi from '../../src/types/doi';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';

const editorialCommunities: EditorialCommunityRepository = createEditorialCommunityRepository();

const articleA = new Doi('10.1101/833392');
const articleAReview1 = new Doi('10.5281/zenodo.3678325');

describe('fetch-reviews-for-article-page middleware', (): void => {
  it('adds editorial community names to the reviews', async (): Promise<void> => {
    const reviewReferenceRepository = createReviewReferenceRepository();
    await reviewReferenceRepository.add(articleA, articleAReview1, editorialCommunities.all()[0].id, new Date('2020-05-19T14:00:00Z'));
    const fetchReview: FetchReview = async (reviewId) => ({
      publicationDate: new Date(),
      summary: '',
      editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      url: new URL(`https://doi.org/${reviewId.value}`),
    });
    const fetchReviews = createFetchReviews(
      reviewReferenceRepository,
      fetchReview,
      editorialCommunities,
    );
    const reviews = await fetchReviews(new Doi('10.1101/833392'));

    expect(reviews[0].editorialCommunityName).toStrictEqual(editorialCommunities.all()[0].name);
  });
});
