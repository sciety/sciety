import * as E from 'fp-ts/Either';
import { paginate } from '../../../src/group-evaluations-page/evaluated-articles-list/paginate';
import { arbitraryNumber } from '../../helpers';

describe('paginate', () => {
  describe('when there are no events', () => {
    it('returns an empty page 1', () => {
      const activities = paginate(arbitraryNumber(1, 20), 10)([]);

      expect(activities).toStrictEqual(E.right(expect.objectContaining({
        items: [],
      })));
    });
  });
});
