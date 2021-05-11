import { performance } from 'perf_hooks';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { findReviewsForArticleDoi } from '../../src/infrastructure/find-reviews-for-article-doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('find-reviews-for-article-doi', () => {
  const article1 = arbitraryDoi();
  const article2 = arbitraryDoi();
  const group1 = arbitraryGroupId();
  const group2 = arbitraryGroupId();
  const reviewId1 = arbitraryReviewId();
  const reviewId2 = arbitraryReviewId();
  const reviewId3 = arbitraryReviewId();
  const getAllEvents = T.of([
    editorialCommunityReviewedArticle(group1, article1, reviewId1, new Date('2020-05-19T00:00:00Z')),
    editorialCommunityReviewedArticle(group1, article2, reviewId2, new Date('2020-05-21T00:00:00Z')),
    editorialCommunityReviewedArticle(group2, article1, reviewId3, new Date('2020-05-20T00:00:00Z')),
  ]);

  describe('findReviewsForArticleDoi', () => {
    it.each([
      [article1, [reviewId1, reviewId3]],
      [article2, [reviewId2]],
      [arbitraryDoi(), []],
    ])('finds the review references for article %s', async (articleDoi, expectedReviews) => {
      const actualReviews = await pipe(
        getAllEvents,
        findReviewsForArticleDoi(articleDoi),
        T.map(RA.map((reviewReference) => reviewReference.reviewId)),
      )();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });
  });

  describe('given a large set of events', () => {
    const numberOfEvents = 55000;

    const events = (
      [...Array(numberOfEvents)].map(() => editorialCommunityReviewedArticle(
        arbitraryGroupId(),
        arbitraryDoi(),
        arbitraryReviewId(),
        arbitraryDate(),
      ))
    );

    it('performs acceptably', async () => {
      const startTime = performance.now();
      await findReviewsForArticleDoi(arbitraryDoi())(T.of(events))();
      const endTime = performance.now();
      const runtime = endTime - startTime;

      expect(runtime).toBeLessThan(50);
    });
  });
});
