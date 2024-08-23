import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getAnnotationContent } from '../../../src/read-models/annotations/get-annotation-content';
import { handleEvent, initialState } from '../../../src/read-models/annotations/handle-event';
import { rawUserInput } from '../../../src/read-side';
import { ArticleId } from '../../../src/types/article-id';
import * as EDOI from '../../../src/types/expression-doi';
import { arbitraryExpressionAddedToListEvent, arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUnsafeUserInput } from '../../types/unsafe-user-input.helper';

describe('get-annotation-content', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();
  /** @deprecated roll out expressionDois in list resource events */
  const articleId = new ArticleId(expressionDoi);
  const content = arbitraryUnsafeUserInput();
  const runQuery = (events: ReadonlyArray<DomainEvent>) => {
    const readmodel = pipe(
      events,
      RA.reduce(initialState(), handleEvent),
    );
    const annotationContent = getAnnotationContent(readmodel)(listId, articleId);
    return annotationContent;
  };

  describe('when the requested list has been created', () => {
    const listCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listId,
    };
    const listDeletedEvent = {
      ...arbitraryListDeletedEvent(),
      listId,
    };

    describe('and the requested article is not in this list', () => {
      const events = [
        listCreatedEvent,
      ];

      it('returns no annotation', () => {
        expect(runQuery(events)).toStrictEqual(O.none);
      });
    });

    describe('and the requested article has been added to this list', () => {
      const expressionAddedToListEvent = constructEvent('ExpressionAddedToList')({ listId, expressionDoi });
      const articleAnnotatedEvent = constructEvent('ArticleInListAnnotated')({ articleId, listId, content });
      const articleRemovedFromListEvent = constructEvent('ArticleRemovedFromList')({ articleId, listId });

      describe('and the requested article has been annotated in this list', () => {
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          constructEvent('ArticleInListAnnotated')({ listId, articleId, content }),
        ];

        it('returns the annotation content', () => {
          expect(runQuery(events)).toStrictEqual(O.some(rawUserInput(content)));
        });
      });

      describe('and the requested article has not been annotated in this list', () => {
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });

      describe('and the requested article has been annotated in a different list', () => {
        const differentListId = arbitraryListId();
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          {
            ...arbitraryListCreatedEvent(),
            listId: differentListId,
          },
          constructEvent('ExpressionAddedToList')({ listId: differentListId, expressionDoi }),
          constructEvent('ArticleInListAnnotated')({ listId: differentListId, articleId, content }),
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });

      describe('and a different article has been added to, and annotated in, this list', () => {
        const differentArticleId = new ArticleId(arbitraryExpressionDoi());
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          {
            ...arbitraryExpressionAddedToListEvent(),
            listId,
            expressionDoi: EDOI.fromValidatedString(differentArticleId.value),
          },
          constructEvent('ArticleInListAnnotated')({ listId, articleId: differentArticleId, content }),
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });

      describe('and the requested article has been annotated and then removed from this list', () => {
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          articleAnnotatedEvent,
          articleRemovedFromListEvent,
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });

      describe('and the requested article has been annotated, then removed and then re-added from this list', () => {
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          articleAnnotatedEvent,
          articleRemovedFromListEvent,
          constructEvent('ExpressionAddedToList')({ expressionDoi, listId }),
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });

      describe('and the requested article was annotated and removed from this list, re-added and re-annotated', () => {
        const newContent = arbitraryUnsafeUserInput();
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          articleAnnotatedEvent,
          articleRemovedFromListEvent,
          constructEvent('ExpressionAddedToList')({ expressionDoi, listId }),
          constructEvent('ArticleInListAnnotated')({ articleId, listId, content: newContent }),
        ];

        it('returns only the new annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.some(rawUserInput(newContent)));
        });
      });

      describe('and the requested article was annotated and this list was deleted', () => {
        const events = [
          listCreatedEvent,
          expressionAddedToListEvent,
          articleAnnotatedEvent,
          listDeletedEvent,
        ];

        it('returns no annotation', () => {
          expect(runQuery(events)).toStrictEqual(O.none);
        });
      });
    });

    describe('and the requested list has been deleted', () => {
      const events = [
        listCreatedEvent,
        listDeletedEvent,
      ];

      it('returns no annotation', () => {
        expect(runQuery(events)).toStrictEqual(O.none);
      });
    });
  });

  describe('when the list has never existed', () => {
    const events: ReadonlyArray<DomainEvent> = [];

    it('returns no annotation', () => {
      expect(runQuery(events)).toStrictEqual(O.none);
    });
  });
});
