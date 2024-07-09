import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import {
  arbitraryArticleAddedToListEvent,
  arbitraryArticleRemovedFromListEvent,
  arbitraryListCreatedEvent,
} from '../../domain-events/list-resource-events.helper';

describe('handle-event', () => {
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
