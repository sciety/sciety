import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { findReviewsForArticleDoi } from '../../src/infrastructure/find-reviews-for-article-doi';
import { Doi } from '../../src/types/doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';

describe('find-reviews-for-article-doi', () => {
  const article1 = new Doi('10.1000/1');
  const article2 = new Doi('10.99999/2');
  const editorialCommunity1 = new GroupId('community-1');
  const editorialCommunity2 = new GroupId('community-2');
  const reviewId1 = new Doi('10.5555/1');
  const reviewId2 = new Doi('10.6666/2');
  const reviewId3 = new Doi('10.7777/3');
  const getAllEvents = T.of([
    editorialCommunityReviewedArticle(editorialCommunity1, article1, reviewId1, new Date('2020-05-19T00:00:00Z')),
    editorialCommunityReviewedArticle(editorialCommunity1, article2, reviewId2, new Date('2020-05-21T00:00:00Z')),
    editorialCommunityReviewedArticle(editorialCommunity2, article1, reviewId3, new Date('2020-05-20T00:00:00Z')),
  ]);

  describe('findReviewsForArticleDoi', () => {
    it.each([
      [article1, [reviewId1, reviewId3]],
      [article2, [reviewId2]],
      [new Doi('10.0000/does-not-exist'), []],
    ])('finds the review references for article %s', async (articleDoi, expectedReviews) => {
      const actualReviews = await pipe(
        articleDoi,
        findReviewsForArticleDoi(getAllEvents),
        T.map(RA.map((reviewReference) => reviewReference.reviewId)),
      )();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });
  });
});
