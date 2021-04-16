import * as O from 'fp-ts/Option';
import { groupActivities } from '../../src/group-page/group-activities';
import { Doi } from '../../src/types/doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';

describe('group-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = new Doi('10.1101/2020.09.15.286153');
    const groupId = new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.24072/pci.animsci.100005'),
        new Date('2020-12-15T00:00:00.000Z'),
      ),
    ];

    it('includes the article DOI', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some([
          expect.objectContaining({
            doi: articleId,
          }),
        ]),
      );
    });

    it('has an evaluation count of 1', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some([
          expect.objectContaining({
            evaluationCount: 1,
          }),
        ]),
      );
    });

    it('latest activity date matches event date', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some([
          expect.objectContaining({
            latestActivityDate: new Date('2020-12-15T00:00:00.000Z'),
          }),
        ]),
      );
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    it.todo('has a single entry for the article');

    it.todo('has an evaluation count of the number of evaluations');

    it.todo('has a latest activity date of the latest evaluation');
  });

  describe('when multiple groups have evaluated an article', () => {
    const groupId = new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa');
    const articleId = new Doi('10.1101/2019.12.20.884056');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        new Doi('10.24072/pci.animsci.100004'),
        new Date('2020-10-14T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
        articleId,
        new Doi('10.7287/peerj.11014v0.1/reviews/1'),
        new Date('2021-03-10T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
        articleId,
        new Doi('10.7287/peerj.11014v0.1/reviews/2'),
        new Date('2021-03-10T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
        articleId,
        new Doi('10.7287/peerj.11014v0.2/reviews/2'),
        new Date('2021-03-10T00:00:00.000Z'),
      ),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some([
          expect.objectContaining({
            doi: articleId,
            evaluationCount: 4,
          }),
        ]),
      );
    });

    it('has a latest activity date of the latest evaluation by any group', () => {
      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some([
          expect.objectContaining({
            latestActivityDate: new Date('2021-03-10T00:00:00.000Z'),
          }),
        ]),
      );
    });
  });

  describe('when the group has evaluated multiple articles', () => {
    it.todo('returns the most recently evaluated articles first');

    it.todo('limits the number of entries to 10');
  });

  describe('when another group evaluates an article previously evaluated by this group', () => {
    it.todo('orders by the evaluation date of this group');
  });

  describe('when the group has not evaluated any articles', () => {
    it.todo('returns an empty list');
  });

  describe('when the group does not exist', () => {
    it.todo('returns a None');
  });
});
