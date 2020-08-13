import createReviewReferenceRepository from '../../src/infrastructure/in-memory-review-references';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import dummyLogger from '../dummy-logger';

describe('review-reference-repository', () => {
  let reviewReferenceRepository: ReviewReferenceRepository;

  const article1 = new Doi('10.1000/1');
  const article2 = new Doi('10.99999/2');
  const editorialCommunity1 = new EditorialCommunityId('community-1');
  const editorialCommunity2 = new EditorialCommunityId('community-2');

  describe('when empty', () => {
    beforeEach(() => {
      reviewReferenceRepository = createReviewReferenceRepository([], dummyLogger);
    });

    it('has no review references for any article version', async () => {
      expect(await reviewReferenceRepository.findReviewsForArticleVersionDoi(article1)).toHaveLength(0);
    });

    it('has no review references for any editorial community', async () => {
      expect(await reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunity1)).toHaveLength(0);
    });
  });

  describe('when populated', () => {
    const reviewId1 = new Doi('10.5555/1');
    const reviewId2 = new Doi('10.6666/2');
    const reviewId3 = new Doi('10.7777/3');

    beforeEach(async () => {
      reviewReferenceRepository = createReviewReferenceRepository(
        [
          {
            type: 'ArticleReviewed',
            articleId: article1,
            reviewId: reviewId1,
            actorId: editorialCommunity1,
            date: new Date('2020-05-19T00:00:00Z'),
          },
          {
            type: 'ArticleReviewed',
            articleId: article2,
            reviewId: reviewId2,
            actorId: editorialCommunity1,
            date: new Date('2020-05-21T00:00:00Z'),
          },
          {
            type: 'ArticleReviewed',
            articleId: article1,
            reviewId: reviewId3,
            actorId: editorialCommunity2,
            date: new Date('2020-05-20T00:00:00Z'),
          },
        ],
        dummyLogger,
      );
    });

    it('is an iterable', () => {
      const actualReviews = Array.from(reviewReferenceRepository)
        .map((reviewReference) => reviewReference.reviewId)
        .sort();
      const expectedReviews = [reviewId1, reviewId2, reviewId3];

      expect(actualReviews).toStrictEqual(expectedReviews);
    });

    it.each([
      [article1, [reviewId1, reviewId3]],
      [article2, [reviewId2]],
      [new Doi('10.0000/does-not-exist'), []],
    ])('finds the review references for article %s', async (articleDoi, expectedReviews) => {
      const actualReviews = (await reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi))
        .map((reviewReference) => reviewReference.reviewId)
        .sort();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });

    it.each([
      [editorialCommunity1, [reviewId1, reviewId2]],
      [editorialCommunity2, [reviewId3]],
      [new EditorialCommunityId('does-not-exist'), []],
    ])('finds the review references for editorial community ID %s', async (editorialCommunityId, expectedReviews) => {
      const actualReviews = (await reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunityId))
        .map((reviewReference) => reviewReference.reviewId)
        .sort();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });
  });
});
