import createReviewProjections from '../../src/infrastructure/review-projections';
import { Doi } from '../../src/types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';

describe('review-projections', () => {
  const article1 = new Doi('10.1000/1');
  const article2 = new Doi('10.99999/2');
  const editorialCommunity1 = new EditorialCommunityId('community-1');
  const editorialCommunity2 = new EditorialCommunityId('community-2');
  const reviewId1 = new Doi('10.5555/1');
  const reviewId2 = new Doi('10.6666/2');
  const reviewId3 = new Doi('10.7777/3');
  const reviewEvents: Array<EditorialCommunityReviewedArticleEvent> = [
    {
      type: 'EditorialCommunityReviewedArticle',
      articleId: article1,
      reviewId: reviewId1,
      editorialCommunityId: editorialCommunity1,
      date: new Date('2020-05-19T00:00:00Z'),
    },
    {
      type: 'EditorialCommunityReviewedArticle',
      articleId: article2,
      reviewId: reviewId2,
      editorialCommunityId: editorialCommunity1,
      date: new Date('2020-05-21T00:00:00Z'),
    },
    {
      type: 'EditorialCommunityReviewedArticle',
      articleId: article1,
      reviewId: reviewId3,
      editorialCommunityId: editorialCommunity2,
      date: new Date('2020-05-20T00:00:00Z'),
    },
  ];

  describe('findReviewsForArticleDoi', () => {
    it.each([
      [article1, [reviewId1, reviewId3]],
      [article2, [reviewId2]],
      [new Doi('10.0000/does-not-exist'), []],
    ])('finds the review references for article %s', async (articleDoi, expectedReviews) => {
      const getReviews = createReviewProjections(reviewEvents).findReviewsForArticleDoi;
      const actualReviews = (await getReviews(articleDoi)())
        .map((reviewReference) => reviewReference.reviewId)
        .sort();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });
  });
});
