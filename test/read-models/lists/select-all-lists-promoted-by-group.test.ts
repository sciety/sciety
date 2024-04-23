import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EventOfType } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsPromotedByGroup } from '../../../src/read-models/lists/select-all-lists-promoted-by-group';
import { arbitraryListPromotionCreatedEvent } from '../../domain-events/list-promotion-resource-events.helper';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('select-all-lists-promoted-by-group', () => {
  const groupId = arbitraryGroupId();

  describe('when no lists have ever been promoted by a group', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupId);

    it('returns no lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a list has been promoted by a group', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listPromotedByGroup: EventOfType<'ListPromotionCreated'> = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: groupId,
      listId: listCreated.listId,
    };
    const readModel = pipe(
      [
        listCreated,
        listPromotedByGroup,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupId);

    it('returns that list', () => {
      expect(result[0].id).toStrictEqual(listCreated.listId);
    });
  });

  describe('when two lists have been promoted by a group', () => {
    it.todo('returns those two lists');
  });
});
