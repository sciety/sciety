import * as O from 'fp-ts/Option';
import { groupActivities } from '../../src/group-page/group-activities';
import { Doi } from '../../src/types/doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';

describe('group-activities', () => {
  describe('when a group has evaluated an article', () => {
    it('includes the article', async () => {
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

      const activities = groupActivities(events)(groupId);

      expect(activities).toStrictEqual(
        O.some(expect.arrayContaining([
          expect.objectContaining({
            doi: articleId,
          }),
        ])),
      );
    });
  });
});
