import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsFeaturedForGroup } from '../../../src/read-models/lists/select-all-lists-featured-for-group';
import { arbitraryListCreatedEvent, arbitraryListFeaturedForGroupEvent } from '../../domain-events/list-resource-events.helper';
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
    const listCreated = arbitraryListCreatedEvent();
    const listFeaturedForGroup = {
      ...arbitraryListFeaturedForGroupEvent(),
      featuredFor: groupId,
      listId: listCreated.listId,
    };
    const readModel = pipe(
      [
        listCreated,
        listFeaturedForGroup,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsFeaturedForGroup(readModel)(groupId);

    it('returns that list', () => {
      expect(result[0].id).toStrictEqual(listCreated.listId);
    });
  });

  describe('when two lists have been featured for a group', () => {
    it.todo('returns those two lists');
  });
});
