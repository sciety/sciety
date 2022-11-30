import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, articleRemovedFromList, listCreated, listNameEdited,
} from '../../../src/domain-events';
import { handleEvent, initialState, selectAllListsOwnedBy } from '../../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('select-all-lists-owned-by', () => {
  const ownerId = arbitraryListOwnerId();

  describe('when the owner does not own any list', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId);

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the owner owns an empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const listCreationDate = arbitraryDate();
    const readmodel = pipe(
      [
        listCreated(listId, listName, listDescription, ownerId, listCreationDate),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.listId).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the list creation date as the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(listCreationDate);
    });
  });

  describe('when the owner owns a list where some articles have been added', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const dateOfLastEvent = new Date('2021-07-08');
    const readmodel = pipe(
      [
        listCreated(listId, listName, listDescription, ownerId),
        articleAddedToList(arbitraryArticleId(), listId),
        articleAddedToList(arbitraryArticleId(), listId, dateOfLastEvent),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.listId).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when the owner owns a list where the list name has been changed', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const dateOfLastEvent = new Date('2021-07-08');
    const readmodel = pipe(
      [
        listCreated(listId, arbitraryString(), listDescription, ownerId),
        listNameEdited(listId, listName, dateOfLastEvent),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.listId).toBe(listId);
    });

    it('returns the updated name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when the owner owns a list where some articles have been removed', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const dateOfLastEvent = arbitraryDate();
    const removedArticleId = arbitraryArticleId();
    const readmodel = pipe(
      [
        listCreated(listId, listName, listDescription, ownerId),
        articleAddedToList(arbitraryArticleId(), listId),
        articleAddedToList(removedArticleId, listId),
        articleRemovedFromList(removedArticleId, listId, dateOfLastEvent),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.listId).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when a list with a different owner contains some articles', () => {
    const anotherOwnerId = arbitraryListOwnerId();
    const anotherListId = arbitraryListId();
    const readmodel = pipe(
      [
        listCreated(anotherListId, arbitraryString(), arbitraryString(), anotherOwnerId),
        articleAddedToList(arbitraryArticleId(), anotherListId),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId);

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the owner owns multiple lists', () => {
    const list1Id = arbitraryListId();
    const list2Id = arbitraryListId();
    const readmodel = pipe(
      [
        listCreated(list1Id, arbitraryString(), arbitraryString(), ownerId, new Date('2022-01-01')),
        listCreated(list2Id, arbitraryString(), arbitraryString(), ownerId, new Date('2022-01-02')),
        articleAddedToList(arbitraryArticleId(), list1Id, new Date('2022-01-03')),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId);

    it('returns the lists in ascending order by last updated', () => {
      expect(result[0].lastUpdated).toStrictEqual(new Date('2022-01-02'));
      expect(result[0].listId).toStrictEqual(list2Id);

      expect(result[1].lastUpdated).toStrictEqual(new Date('2022-01-03'));
      expect(result[1].listId).toStrictEqual(list1Id);
    });
  });
});
