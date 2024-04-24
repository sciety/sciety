import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EventOfType } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsPromotedByGroup } from '../../../src/read-models/lists/select-all-lists-promoted-by-group';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryListPromotionCreatedEvent } from '../../domain-events/list-promotion-resource-events.helper';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('select-all-lists-promoted-by-group', () => {
  const groupJoined = arbitraryGroupJoinedEvent();

  describe('when no lists have ever been promoted by a group', () => {
    const readModel = pipe(
      [
        groupJoined,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns no lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a list has been promoted by a group', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listPromotedByGroup: EventOfType<'ListPromotionCreated'> = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: groupJoined.groupId,
      listId: listCreated.listId,
    };
    const readModel = pipe(
      [
        groupJoined,
        listCreated,
        listPromotedByGroup,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns that list', () => {
      expect(result[0].id).toStrictEqual(listCreated.listId);
    });
  });

  describe('when two lists have been promoted by a group', () => {
    const list1Created = arbitraryListCreatedEvent();
    const list2Created = arbitraryListCreatedEvent();
    const list1PromotedByGroup: EventOfType<'ListPromotionCreated'> = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: groupJoined.groupId,
      listId: list1Created.listId,
    };
    const list2PromotedByGroup: EventOfType<'ListPromotionCreated'> = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: groupJoined.groupId,
      listId: list2Created.listId,
    };
    const readModel = pipe(
      [
        groupJoined,
        list1Created,
        list2Created,
        list1PromotedByGroup,
        list2PromotedByGroup,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns those two lists', () => {
      expect(result[0].id).toStrictEqual(list1Created.listId);
      expect(result[1].id).toStrictEqual(list2Created.listId);
    });
  });

  describe('when the promoted list does not exist', () => {
    const listPromotedByGroup: EventOfType<'ListPromotionCreated'> = {
      ...arbitraryListPromotionCreatedEvent(),
      byGroup: groupJoined.groupId,
      listId: arbitraryListId(),
    };
    const readModel = pipe(
      [
        groupJoined,
        listPromotedByGroup,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('ignores that promotion', () => {
      expect(result).toStrictEqual([]);
    });
  });
});