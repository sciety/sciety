import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsFeaturedForGroup } from '../../../src/read-models/lists/select-all-lists-featured-for-group';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('select-all-lists-featured-for-group', () => {
  const groupId = arbitraryGroupId();

  describe('when no lists have ever been featured for a group', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsFeaturedForGroup(readModel)(groupId);

    it('returns no lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a list has been featured for a group', () => {
    it.todo('returns that list');
  });
});
