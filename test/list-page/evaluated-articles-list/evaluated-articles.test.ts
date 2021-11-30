/* eslint-disable jest/expect-expect */
import { performance } from 'perf_hooks';
import * as O from 'fp-ts/Option';
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
      evaluationRecorded(
        groupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        date,
      ),
    ];

    it('includes the article DOI', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of 1', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 1,
        }),
      ]);
    });

    it('latest activity date matches publication date of the evaluation', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: O.some(date),
        }),
      ]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const latestActivityDate = new Date('2020-01-01');
    const events = [
      evaluationRecorded(
        groupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        new Date('1980-01-01'),
      ),
      evaluationRecorded(
        groupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        latestActivityDate,
      ),
    ];

    it('has a single entry for the article', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of the number of evaluations', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 2,
        }),
      ]);
    });

    it('has a latest activity date of the publication of the latest evaluation', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: O.some(latestActivityDate),
        }),
      ]);
    });
  });

  describe('when multiple groups have evaluated an article', () => {
    const groupId = arbitraryGroupId();
    const otherGroupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const mostRecentActivityDate = new Date('2021-03-10T00:00:00.000Z');
    const events = [
      evaluationRecorded(
        groupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        new Date('2020-10-14T00:00:00.000Z'),
      ),
      evaluationRecorded(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        mostRecentActivityDate,
      ),
      evaluationRecorded(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        mostRecentActivityDate,
      ),
      evaluationRecorded(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        arbitraryDate(),
        [],
        mostRecentActivityDate,
      ),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
          evaluationCount: 4,
        }),
      ]);
    });

    it('has a latest activity date of the publication of the latest evaluation by any group', () => {
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: O.some(mostRecentActivityDate),
        }),
      ]);
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
        evaluationRecorded(
          groupId,
          article1,
          arbitraryReviewId(),
          earlierDate,
        ),
        evaluationRecorded(
          groupId,
          article2,
          arbitraryReviewId(),
          laterDate,
        ),
      ];
      const activities = evaluatedArticles(groupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: article2,
        }),
        expect.objectContaining({
          doi: article1,
        }),
      ]);
    });
  });

  describe('when another group evaluates an article previously evaluated by this group', () => {
    it('orders by the evaluation date of this group', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const articleMostRecentlyReviewedByThisGroup = arbitraryDoi();
      const articleThatWasMoreRecentlyReviewedButByAnotherGroup = arbitraryDoi();
      const events = [
        evaluationRecorded(
          thisGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          arbitraryReviewId(),
          new Date('1980-01-01'),
        ),
        evaluationRecorded(
          thisGroupId,
          articleMostRecentlyReviewedByThisGroup,
          arbitraryReviewId(),
          new Date('2000-01-01'),
        ),
        evaluationRecorded(
          anotherGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          arbitraryReviewId(),
          new Date('2020-01-01'),
        ),
      ];

      const activities = evaluatedArticles(thisGroupId)(events);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleMostRecentlyReviewedByThisGroup,
        }),
        expect.objectContaining({
          doi: articleThatWasMoreRecentlyReviewedButByAnotherGroup,
        }),
      ]);
    });
  });

  describe('when the group has not evaluated any articles', () => {
    it('returns an empty list', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const events = [
        evaluationRecorded(
          anotherGroupId,
          arbitraryDoi(),
          arbitraryReviewId(),
          arbitraryDate(),
        ),
      ];

      const activities = evaluatedArticles(thisGroupId)(events);

      expect(activities).toStrictEqual([]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => evaluationRecorded(
        arbitraryGroupId(),
        arbitraryDoi(),
        arbitraryReviewId(),
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
