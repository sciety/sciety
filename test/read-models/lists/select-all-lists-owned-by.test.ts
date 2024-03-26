import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { selectAllListsOwnedBy } from '../../../src/read-models/lists/select-all-lists-owned-by';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { rawUserInput } from '../../../src/read-side';
import { arbitraryArticleAddedToListEvent, arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';

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
    const listCreated = arbitraryListCreatedEvent();
    const readmodel = pipe(
      [
        listCreated,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(listCreated.ownerId)[0];

    it('returns the list id', () => {
      expect(result.id).toBe(listCreated.listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listCreated.name);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(rawUserInput(listCreated.description));
    });

    it('returns the list creation date as the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(listCreated.date);
    });
  });

  describe('when the owner owns a list where some articles have been added', () => {
    const listCreated = arbitraryListCreatedEvent();
    const dateOfLastEvent = new Date('2021-07-08');
    const readmodel = pipe(
      [
        listCreated,
        {
          ...arbitraryArticleAddedToListEvent(),
          listId: listCreated.listId,
        },
        {
          ...arbitraryArticleAddedToListEvent(),
          listId: listCreated.listId,
          date: dateOfLastEvent,
        },
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(listCreated.ownerId)[0];

    it('returns the list id', () => {
      expect(result.id).toBe(listCreated.listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listCreated.name);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(rawUserInput(listCreated.description));
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when the owner owns a list where the list name has been changed', () => {
    const listCreated = arbitraryListCreatedEvent();
    const dateOfLastEvent = new Date('2021-07-08');
    const listNameEdited = constructEvent('ListNameEdited')({
      listId: listCreated.listId,
      name: arbitraryString(),
      date: dateOfLastEvent,
    });
    const readmodel = pipe(
      [
        listCreated,
        listNameEdited,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(listCreated.ownerId)[0];

    it('returns the list id', () => {
      expect(result.id).toBe(listCreated.listId);
    });

    it('returns the updated name of the list', () => {
      expect(result.name).toStrictEqual(listNameEdited.name);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(rawUserInput(listCreated.description));
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when the owner owns a list where some articles have been removed', () => {
    const listCreated = arbitraryListCreatedEvent();
    const dateOfLastEvent = arbitraryDate();
    const removedArticleId = arbitraryArticleId();
    const readmodel = pipe(
      [
        listCreated,
        constructEvent('ArticleAddedToList')({
          articleId: arbitraryArticleId(),
          listId: listCreated.listId,
        }),
        constructEvent('ArticleAddedToList')({
          articleId: removedArticleId,
          listId: listCreated.listId,
        }),
        constructEvent('ArticleRemovedFromList')({
          articleId: removedArticleId,
          listId: listCreated.listId,
          date: dateOfLastEvent,
        }),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(listCreated.ownerId)[0];

    it('returns the list id', () => {
      expect(result.id).toBe(listCreated.listId);
    });

    it('returns the name of the list', () => {
      expect(result.name).toStrictEqual(listCreated.name);
    });

    it('returns the description of the list', () => {
      expect(result.description).toStrictEqual(rawUserInput(listCreated.description));
    });

    it('returns the last updated date', () => {
      expect(result.updatedAt).toStrictEqual(dateOfLastEvent);
    });
  });

  describe('when a list with a different owner contains some articles', () => {
    const anotherListId = arbitraryListId();
    const readmodel = pipe(
      [
        {
          ...arbitraryListCreatedEvent(),
          listId: anotherListId,
        },
        {
          ...arbitraryArticleAddedToListEvent(),
          listId: anotherListId,
        },
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = selectAllListsOwnedBy(readmodel)(ownerId);

    it('returns an empty array of lists', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
