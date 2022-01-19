/* eslint-disable jest/expect-expect */
import { performance } from 'perf_hooks';
import { evaluationRecorded } from '../../../src/domain-events';
import { evaluatedArticles } from '../../../src/list-page/evaluated-articles-list/evaluated-articles';
import { arbitraryDate, arbitraryWord } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('evaluated-articles', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryDoi();
    const groupId = arbitraryGroupId();
    const date = arbitraryDate();
    const events = [
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], date, arbitraryDate()),
    ];

    it('includes the article DOI', () => {
      const articleIds = evaluatedArticles(groupId)(events);

      expect(articleIds).toStrictEqual([articleId]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const latestActivityDate = new Date('2020-01-01');
    const events = [
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], latestActivityDate, arbitraryDate()),
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], new Date('1980-01-01'), arbitraryDate()),
    ];

    it('has a single entry for the article', () => {
      const articleIds = evaluatedArticles(groupId)(events);

      expect(articleIds).toStrictEqual([articleId]);
    });
  });

  describe('when the group has evaluated multiple articles', () => {
    const groupId = arbitraryGroupId();

    it('returns the most recently evaluated articles first', () => {
      const article1 = arbitraryDoi();
      const article2 = arbitraryDoi();
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events = [
        evaluationRecorded(groupId, article1, arbitraryReviewId(), [], new Date(), earlierDate),
        evaluationRecorded(groupId, article2, arbitraryReviewId(), [], new Date(), laterDate),
      ];
      const articleIds = evaluatedArticles(groupId)(events);

      expect(articleIds).toStrictEqual([article2, article1]);
    });
  });

  describe('when another group evaluates an article previously evaluated by this group', () => {
    it('orders by the evaluation date of this group', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const articleMostRecentlyReviewedByThisGroup = arbitraryDoi();
      const articleThatWasMoreRecentlyReviewedButByAnotherGroup = arbitraryDoi();
      const events = [
        evaluationRecorded(thisGroupId, articleThatWasMoreRecentlyReviewedButByAnotherGroup, arbitraryReviewId(), [], new Date(), new Date('1980-01-01')),
        evaluationRecorded(thisGroupId, articleMostRecentlyReviewedByThisGroup, arbitraryReviewId(), [], new Date(), new Date('2000-01-01')),
        evaluationRecorded(anotherGroupId, articleThatWasMoreRecentlyReviewedButByAnotherGroup, arbitraryReviewId(), [], new Date(), new Date('2020-01-01')),
      ];

      const articleIds = evaluatedArticles(thisGroupId)(events);

      expect(articleIds).toStrictEqual([
        articleMostRecentlyReviewedByThisGroup,
        articleThatWasMoreRecentlyReviewedButByAnotherGroup,
      ]);
    });
  });

  describe('when the group has not evaluated any articles', () => {
    it('returns an empty list', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const events = [
        evaluationRecorded(anotherGroupId, arbitraryDoi(), arbitraryReviewId(), [], new Date(), arbitraryDate()),
      ];

      const articleIds = evaluatedArticles(thisGroupId)(events);

      expect(articleIds).toStrictEqual([]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => evaluationRecorded(
        arbitraryGroupId(),
        arbitraryDoi(),
        arbitraryReviewId(),
        [],
        new Date(),
        arbitraryDate(),
      ))
    );

    it('performs acceptably', async () => {
      const group = {
        id: arbitraryGroupId(),
        name: arbitraryWord(),
        avatarPath: arbitraryWord(),
        descriptionPath: arbitraryWord(),
        shortDescription: arbitraryWord(),
      };
      const startTime = performance.now();
      evaluatedArticles(group.id)(events);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(350);
    });
  });
});
