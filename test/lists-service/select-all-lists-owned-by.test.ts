import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../src/domain-events';
import { selectAllListsOwnedBy } from '../../src/lists-service/select-all-lists-owned-by';
import { List } from '../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('select-all-lists-owned-by', () => {
  const ownerId = arbitraryGroupId();

  describe('when the group does not own any list', () => {
    let result: ReadonlyArray<List>;

    beforeEach(async () => {
      result = pipe(
        [],
        selectAllListsOwnedBy(ownerId),
      );
    });

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the group owns an empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const listCreationDate = arbitraryDate();
    let result: List;

    beforeEach(async () => {
      result = pipe(
        [
          listCreated(listId, listName, listDescription, ownerId, listCreationDate),
        ],
        selectAllListsOwnedBy(ownerId),
        (lists) => lists[0],
      );
    });

    it('returns the list id', () => {
      expect(result.id).toBe(listId);
    });

    it('returns the list name', () => {
      expect(result.name).toBe(listName);
    });

    it('returns the list description', () => {
      expect(result.description).toBe(listDescription);
    });

    it('returns a count of 0', () => {
      expect(result.articleCount).toBe(0);
    });

    it('returns the list creation date as last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(listCreationDate);
    });
  });

  describe('when the group owns a non-empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const dateOfLatestEvent = arbitraryDate();
    let result: List;

    beforeEach(async () => {
      result = pipe(
        [
          listCreated(listId, listName, listDescription, ownerId),
          articleAddedToList(arbitraryDoi(), listId),
          articleAddedToList(arbitraryDoi(), listId, dateOfLatestEvent),
        ],
        selectAllListsOwnedBy(ownerId),
        (lists) => lists[0],
      );
    });

    it('returns the list id', () => {
      expect(result.id).toBe(listId);
    });

    it('returns the list name', () => {
      expect(result.name).toBe(listName);
    });

    it('returns the list description', () => {
      expect(result.description).toBe(listDescription);
    });

    it('returns a count of the articles', () => {
      expect(result.articleCount).toBe(2);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(dateOfLatestEvent);
    });
  });

  describe('when the selected group does not own any lists, but a different group does', () => {
    const differentOwnerId = arbitraryGroupId();
    let result: ReadonlyArray<List>;

    beforeEach(async () => {
      result = pipe(
        [
          listCreated(arbitraryListId(), arbitraryString(), arbitraryString(), differentOwnerId),
        ],
        selectAllListsOwnedBy(ownerId),
      );
    });

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
