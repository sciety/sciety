import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { EventOfType } from '../../../src/domain-events';
import { deprecatedSelectAllListsPromotedByGroup } from '../../../src/read-models/lists/deprecated-select-all-lists-promoted-by-group';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { GroupId } from '../../../src/types/group-id';
import { ListId } from '../../../src/types/list-id';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryListPromotionCreatedEvent, arbitraryListPromotionRemovedEvent } from '../../domain-events/list-promotion-resource-events.helper';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryListId } from '../../types/list-id.helper';

const listPromotedByGroup = (groupId: GroupId, listId: ListId): EventOfType<'ListPromotionCreated'> => ({
  ...arbitraryListPromotionCreatedEvent(),
  byGroup: groupId,
  listId,
});

const listPromotionRemovedByGroup = (groupId: GroupId, listId: ListId): EventOfType<'ListPromotionRemoved'> => ({
  ...arbitraryListPromotionRemovedEvent(),
  byGroup: groupId,
  listId,
});

describe('deprecated-select-all-lists-promoted-by-group', () => {
  const groupJoined = arbitraryGroupJoinedEvent();
  const listCreated = arbitraryListCreatedEvent();

  describe('when no lists have ever been promoted by a group', () => {
    const readModel = pipe(
      [
        groupJoined,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = deprecatedSelectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns no lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a list has been promoted by a group', () => {
    const readModel = pipe(
      [
        groupJoined,
        listCreated,
        listPromotedByGroup(groupJoined.groupId, listCreated.listId),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = deprecatedSelectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns that list', () => {
      expect(result[0].id).toStrictEqual(listCreated.listId);
    });
  });

  describe('when a list has been promoted and later demoted by a group', () => {
    const readModel = pipe(
      [
        groupJoined,
        listCreated,
        listPromotedByGroup(groupJoined.groupId, listCreated.listId),
        listPromotionRemovedByGroup(groupJoined.groupId, listCreated.listId),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = deprecatedSelectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it.failing('returns no lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when a list has been promoted, demoted and promoted again by a group', () => {
    it.todo('returns that list');
  });

  describe('when two lists have been promoted by a group', () => {
    const list1Created = arbitraryListCreatedEvent();
    const list2Created = arbitraryListCreatedEvent();
    const readModel = pipe(
      [
        groupJoined,
        list1Created,
        list2Created,
        listPromotedByGroup(groupJoined.groupId, list1Created.listId),
        listPromotedByGroup(groupJoined.groupId, list2Created.listId),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = deprecatedSelectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('returns those two lists', () => {
      expect(result[0].id).toStrictEqual(list1Created.listId);
      expect(result[1].id).toStrictEqual(list2Created.listId);
    });
  });

  describe('when the promoted list does not exist', () => {
    const readModel = pipe(
      [
        groupJoined,
        listPromotedByGroup(groupJoined.groupId, arbitraryListId()),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = deprecatedSelectAllListsPromotedByGroup(readModel)(groupJoined.groupId);

    it('ignores that promotion', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
