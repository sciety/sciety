import { groupActivities } from '../../../src/group-page/recent-activity/group-activities';
import { Doi } from '../../../src/types/doi';
import {
  editorialCommunityReviewedArticle,
  EditorialCommunityReviewedArticleEvent,
} from '../../../src/types/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

const generateNEventsForGroup = (
  numberOfEvents: number,
  groupId: GroupId,
): ReadonlyArray<EditorialCommunityReviewedArticleEvent> => (
  [...Array(numberOfEvents).keys()].map((i) => (editorialCommunityReviewedArticle(
    groupId,
    new Doi(`10.1101/${i}`),
    new Doi(`10.1101/evaluation${i}`),
  ))));

describe('group-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryDoi();
    const groupId = arbitraryGroupId();
    const date = arbitraryDate();
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.24072/pci.animsci.100005'),
        date,
      ),
    ];

    it('includes the article DOI', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of 1', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 1,
        }),
      ]);
    });

    it('latest activity date matches event date', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: date,
        }),
      ]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const articleId = new Doi('10.1101/2019.12.20.884056');
    const latestActivityDate = new Date('2020-01-01');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.1101/123456'),
        new Date('1980-01-01'),
      ),
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.1101/scorpion'),
        latestActivityDate,
      ),
    ];

    it('has a single entry for the article', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of the number of evaluations', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 2,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate,
        }),
      ]);
    });
  });

  describe('when multiple groups have evaluated an article', () => {
    const groupId = arbitraryGroupId();
    const otherGroupId = arbitraryGroupId();
    const articleId = new Doi('10.1101/2019.12.20.884056');
    const mostRecentActivityDate = new Date('2021-03-10T00:00:00.000Z');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.24072/pci.animsci.100004'),
        new Date('2020-10-14T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        new Doi('10.7287/peerj.11014v0.1/reviews/1'),
        mostRecentActivityDate,
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        new Doi('10.7287/peerj.11014v0.1/reviews/2'),
        mostRecentActivityDate,
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        new Doi('10.7287/peerj.11014v0.2/reviews/2'),
        mostRecentActivityDate,
      ),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
          evaluationCount: 4,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation by any group', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: mostRecentActivityDate,
        }),
      ]);
    });
  });

  describe('when the group has evaluated multiple articles', () => {
    const groupId = arbitraryGroupId();

    it('returns the most recently evaluated articles first', () => {
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events = [
        editorialCommunityReviewedArticle(
          groupId,
          new Doi('10.1101/661249'),
          new Doi('10.24072/pci.animsci.100001'),
          earlierDate,
        ),
        editorialCommunityReviewedArticle(
          groupId,
          new Doi('10.1101/760082'),
          new Doi('10.24072/pci.animsci.100002'),
          laterDate,
        ),
      ];
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: laterDate,
        }),
        expect.objectContaining({
          latestActivityDate: earlierDate,
        }),
      ]);
    });

    it('limits the number of entries to 10', () => {
      const events = generateNEventsForGroup(15, groupId);
      const activities = groupActivities(events)(groupId);

      expect(activities).toHaveLength(10);
    });
  });

  describe('when another group evaluates an article previously evaluated by this group', () => {
    it('orders by the evaluation date of this group', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const articleMostRecentlyReviewedByThisGroup = new Doi('10.1101/2020.09.15.286153');
      const articleThatWasMoreRecentlyReviewedButByAnotherGroup = new Doi('10.1101/2019.12.20.884056');
      const events = [
        editorialCommunityReviewedArticle(
          thisGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          new Doi('10.24072/pci.animsci.100004'),
          new Date('1980-01-01'),
        ),
        editorialCommunityReviewedArticle(
          thisGroupId,
          articleMostRecentlyReviewedByThisGroup,
          new Doi('10.24072/pci.animsci.100005'),
          new Date('2000-01-01'),
        ),
        editorialCommunityReviewedArticle(
          anotherGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          new Doi('10.7287/peerj.11014v0.1/reviews/1'),
          new Date('2020-01-01'),
        ),
      ];

      const activities = groupActivities(events)(thisGroupId);

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
        editorialCommunityReviewedArticle(
          anotherGroupId,
          new Doi('10.1101/2019.12.20.884056'),
          new Doi('10.7287/peerj.11014v0.1/reviews/1'),
          arbitraryDate(),
        ),
      ];

      const activities = groupActivities(events)(thisGroupId);

      expect(activities).toStrictEqual([]);
    });
  });
});
