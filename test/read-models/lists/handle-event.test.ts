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
      const startingReadModelState = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const readModel = handleEvent(startingReadModelState, articleRemoved);

      it('does not change the read model state', () => {
        expect(readModel).toStrictEqual(startingReadModelState);
      });
    });
  });
});
