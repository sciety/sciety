import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { List, selectAllListsOwnedBy } from '../../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('select-all-lists-owned-by', () => {
  const ownerId = arbitraryListOwnerId();

  describe('when the owner does not own any list', () => {
    let result: ReadonlyArray<List>;

    beforeEach(async () => {
      result = await pipe(
        [],
        selectAllListsOwnedBy(ownerId),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the owner owns an empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const listCreationDate = arbitraryDate();
    let result: List;

    beforeEach(async () => {
      result = await pipe(
        [
          listCreated(listId, listName, listDescription, ownerId, listCreationDate),
        ],
        selectAllListsOwnedBy(ownerId),
        TE.getOrElse(shouldNotBeCalled),
        T.map((lists) => lists[0]),
      )();
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

  describe('when the owner owns a non-empty list', () => {
    const listId = arbitraryListId();
    const listName = arbitraryString();
    const listDescription = arbitraryString();
    const newerDate = new Date('2021-07-08');
    let result: List;

    beforeEach(async () => {
      result = await pipe(
        [
          listCreated(listId, listName, listDescription, ownerId),
          articleAddedToList(arbitraryArticleId(), listId),
          articleAddedToList(arbitraryArticleId(), listId, newerDate),
        ],
        selectAllListsOwnedBy(ownerId),
        TE.getOrElse(shouldNotBeCalled),
        T.map((lists) => lists[0]),
      )();
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
      expect(result.lastUpdated).toStrictEqual(newerDate);
    });
  });

  describe('when a list with a different owner contains some articles', () => {
    const anotherOwnerId = arbitraryListOwnerId();
    const anotherListId = arbitraryListId();
    let result: ReadonlyArray<List>;

    beforeEach(async () => {
      result = await pipe(
        [
          listCreated(anotherListId, arbitraryString(), arbitraryString(), anotherOwnerId),
          articleAddedToList(arbitraryArticleId(), anotherListId),
        ],
        selectAllListsOwnedBy(ownerId),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
