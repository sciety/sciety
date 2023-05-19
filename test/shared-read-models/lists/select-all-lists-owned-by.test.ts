import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, articleRemovedFromList, listCreated, constructEvent,
} from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/shared-read-models/lists';
import { selectAllListsOwnedBy } from '../../../src/shared-read-models/lists/select-all-lists-owned-by';
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
      expect(result.id).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the list creation date as the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(listCreationDate);
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
      expect(result.id).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
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
        constructEvent('ListNameEdited')({ listId, name: listName, date: dateOfLastEvent }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.id).toBe(listId);
    });

    it('returns the updated name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
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
      expect(result.id).toBe(listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listName);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(listDescription);
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
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
});
