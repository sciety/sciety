import * as O from 'fp-ts/Option';
import { groupActivities } from '../../src/group-page/group-activities';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';

describe('group-activities', () => {
  describe('when a group has evaluated an article', () => {
    it('includes the article', async () => {
      const activities = groupActivities(new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'));

      expect(activities).toStrictEqual(
        O.some(expect.arrayContaining([
          expect.objectContaining({
            doi: new Doi('10.1101/2020.09.15.286153'),
          }),
        ])),
      );
    });
  });
});
