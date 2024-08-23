import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { annotationsStatus } from '../../../src/read-models/annotations/annotations-status';
import { handleEvent, initialState } from '../../../src/read-models/annotations/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryExpressionAddedToListEvent, arbitraryExpressionInListAnnotatedEvent, arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';

const runQuery = (events: ReadonlyArray<DomainEvent>) => {
  const readmodel = pipe(
    events,
    RA.reduce(initialState(), handleEvent),
  );
  const status = annotationsStatus(readmodel)();
  return status.total;
};

describe('annotations-status', () => {
  describe('when one article has been annotated on one list', () => {
    const listCreated = arbitraryListCreatedEvent();
    const expressionAdded = {
      ...arbitraryExpressionAddedToListEvent(),
      listId: listCreated.listId,
    };
    const articleAnnotated = {
      ...arbitraryExpressionInListAnnotatedEvent(),
      listId: listCreated.listId,
      articleId: new ArticleId(expressionAdded.expressionDoi),
    };
    const events = [
      listCreated,
      expressionAdded,
      articleAnnotated,
    ];

    it('returns 1 as the total number of annotations', () => {
      expect(runQuery(events)).toBe(1);
    });
  });
});
