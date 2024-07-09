import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { arbitraryArticleRemovedFromListEvent, arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';

describe('handle-event', () => {
  describe('given an ArticleRemovedFromList event', () => {
    const listCreated = arbitraryListCreatedEvent();
    const articleRemovedFromListEvent = {
      ...arbitraryArticleRemovedFromListEvent(),
      listId: listCreated.listId,
    };

    describe.each([
      ['when the list does not exist', []],
      ['when the article is not in the list', [listCreated]],
    ])('%s', (_, events) => {
      const startingReadModelState = pipe(
        events,
        RA.reduce(initialState(), handleEvent),
      );

      const readModel = handleEvent(startingReadModelState, articleRemovedFromListEvent);

      it('does not change the read model state', () => {
        expect(readModel).toStrictEqual(startingReadModelState);
      });
    });
  });
});
