import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import {
  arbitraryArticleAddedToListEvent,
  arbitraryArticleRemovedFromListEvent,
  arbitraryListCreatedEvent,
} from '../../domain-events/list-resource-events.helper';

describe('handle-event', () => {
  describe('given a ListCreated event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listDeleted = constructEvent('ListDeleted')({ listId: listCreated.listId });

    describe.each([
      ['when the list exists', [listCreated]],
      ['when the list was created and deleted', [listCreated, listDeleted]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, listCreated);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });

  describe('given a ListDeleted event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listDeleted = constructEvent('ListDeleted')({ listId: listCreated.listId });

    describe.each([
      ['when the list was never created', []],
      ['when the list was created and deleted', [listCreated, listDeleted]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, listDeleted);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });

  describe('given a ListNameEdited event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listDeleted = constructEvent('ListDeleted')({ listId: listCreated.listId });
    const otherListCreated = arbitraryListCreatedEvent();
    const listNameEditedToTheSameValue = constructEvent('ListNameEdited')({
      listId: listCreated.listId,
      name: listCreated.name,
    });

    describe.each([
      ['when no lists exist', []],
      ['when the list has been deleted', [listCreated, listDeleted]],
      ['when the list mentioned in the event does not exist', [otherListCreated]],
      ['when the name in the event matches the name the list has been created with', [listCreated]],
      ['when the name in the event matches the name the list already has been update to', [listCreated, listNameEditedToTheSameValue]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, listNameEditedToTheSameValue);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });

  describe.skip('given a ListDescriptionEdited event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const listDeleted = constructEvent('ListDeleted')({ listId: listCreated.listId });
    const otherListCreated = arbitraryListCreatedEvent();
    const listDescriptionEditedToTheSameValue = constructEvent('ListDescriptionEdited')({
      listId: listCreated.listId,
      description: listCreated.description,
    });

    describe.each([
      ['when no lists exist', []],
      ['when the list has been deleted', [listCreated, listDeleted]],
      ['when the list mentioned in the event does not exist', [otherListCreated]],
      ['when the description in the event matches the description the list has been created with', [listCreated]],
      ['when the description in the event matches the description the list already has been update to', [listCreated, listDescriptionEditedToTheSameValue]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, listDescriptionEditedToTheSameValue);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });

  describe('given an ArticleAddedToList event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const articleAdded = {
      ...arbitraryArticleAddedToListEvent(),
      listId: listCreated.listId,
    };

    describe.each([
      ['when the list does not exist', []],
      ['when the article is already in the list', [listCreated, articleAdded]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, articleAdded);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });

  describe('given an ArticleRemovedFromList event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const articleAdded = {
      ...arbitraryArticleAddedToListEvent(),
      listId: listCreated.listId,
    };
    const articleRemoved = {
      ...arbitraryArticleRemovedFromListEvent(),
      listId: listCreated.listId,
      articleId: articleAdded.articleId,
    };

    describe.each([
      ['when the list does not exist', []],
      ['when the article has never been in the list', [listCreated]],
      ['when the article was added and then removed from the list', [listCreated, articleAdded, articleRemoved]],
    ])('%s', (_, events) => {
      const readModel = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const snapshot = structuredClone(readModel);

      beforeEach(() => {
        handleEvent(readModel, articleRemoved);
      });

      it('does not change the read model state', () => {
        expect(JSON.stringify(readModel)).toStrictEqual(JSON.stringify(snapshot));
      });
    });
  });
});
