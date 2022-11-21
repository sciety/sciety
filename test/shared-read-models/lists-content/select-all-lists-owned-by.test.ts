import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { handleEvent, initialState, selectAllListsOwnedBy } from '../../../src/shared-read-models/lists-content';
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

    it('returns the list creation date as the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(listCreationDate);
    });
  });

  describe('when the owner owns a non-empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const newerDate = new Date('2021-07-08');
    const readmodel = pipe(
      [
        listCreated(listId, listName, listDescription, ownerId),
        articleAddedToList(arbitraryArticleId(), listId),
        articleAddedToList(arbitraryArticleId(), listId, newerDate),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId)[0];

    it('returns the list id', () => {
      expect(result.listId).toBe(listId);
    });

    it('returns the most recent date an article was added as the last updated date', () => {
      expect(result.lastUpdated).toStrictEqual(newerDate);
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
