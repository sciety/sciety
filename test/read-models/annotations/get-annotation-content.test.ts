import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { getAnnotationContent } from '../../../src/read-models/annotations/get-annotation-content';
import { handleEvent, initialState } from '../../../src/read-models/annotations/handle-event';
import { rawUserInput } from '../../../src/read-side';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUnsafeUserInput } from '../../types/unsafe-user-input.helper';

describe('get-annotation-content', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();
  /** @deprecated roll out expressionDois in list resource events */
  const articleId = new ArticleId(expressionDoi);
  const content = arbitraryUnsafeUserInput();

  describe('when the list exists', () => {
    const listCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listId,
    };

    describe('and the article is not in the list', () => {
      it.todo('returns no annotation');
    });

    describe('and the article has been added to the list', () => {
      const articleAddedToListEvent = constructEvent('ArticleAddedToList')({ listId, articleId });

      describe('and the article has been annotated in the list', () => {
        const readmodel = pipe(
          [
            listCreatedEvent,
            articleAddedToListEvent,
            constructEvent('ArticleInListAnnotated')({ listId, articleId, content }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        const annotationContent = getAnnotationContent(readmodel)(listId, articleId);

        it('returns the annotation content', () => {
          expect(annotationContent).toStrictEqual(O.some(rawUserInput(content)));
        });
      });

      describe('and the article has been annotated in a different list', () => {
        const differentListId = arbitraryListId();
        const readmodel = pipe(
          [
            listCreatedEvent,
            articleAddedToListEvent,
            {
              ...arbitraryListCreatedEvent(),
              listId: differentListId,
            },
            constructEvent('ArticleAddedToList')({ listId: differentListId, articleId }),
            constructEvent('ArticleInListAnnotated')({ listId: differentListId, articleId, content }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        const annotationContent = getAnnotationContent(readmodel)(listId, articleId);

        it('returns no annotation', () => {
          expect(annotationContent).toStrictEqual(O.none);
        });
      });

      describe('when a different article has been annotated in the list', () => {
        const readmodel = pipe(
          [
            constructEvent('ArticleInListAnnotated')({ listId, articleId: new ArticleId(arbitraryExpressionDoi()), content }),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        it('returns no annotation', () => {
          expect(getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi))).toStrictEqual(O.none);
        });
      });

      describe('when there have been no annotations', () => {
        const readmodel = pipe(
          [],
          RA.reduce(initialState(), handleEvent),
        );

        it('returns no annotation', () => {
          expect(getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi))).toStrictEqual(O.none);
        });
      });

      describe('an annotated article has been removed from its list', () => {
        const readmodel = pipe(
          [
            constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleInListAnnotated')({ articleId: new ArticleId(expressionDoi), listId, content }),
            constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi), listId }),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        it('returns no annotation', () => {
          expect(getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi))).toStrictEqual(O.none);
        });
      });

      describe('an annotated article has been removed from its list and then re-added', () => {
        const readmodel = pipe(
          [
            constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleInListAnnotated')({ articleId: new ArticleId(expressionDoi), listId, content }),
            constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        it('returns no annotation', () => {
          expect(getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi))).toStrictEqual(O.none);
        });
      });

      describe('an annotated article was removed from its list, re-added and re-annotated', () => {
        const newContent = arbitraryUnsafeUserInput();
        const readmodel = pipe(
          [
            constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleInListAnnotated')({ articleId: new ArticleId(expressionDoi), listId, content }),
            constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
            constructEvent('ArticleInListAnnotated')({ articleId: new ArticleId(expressionDoi), listId, content: newContent }),
          ],
          RA.reduce(initialState(), handleEvent),
        );
        const annotationContent = getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi));

        it('returns only the new annotation', () => {
          expect(annotationContent).toStrictEqual(O.some(rawUserInput(newContent)));
        });
      });
    });
  });

  describe('when the list has never existed', () => {
    it.todo('returns no annotation');
  });

  describe('when the list has been deleted', () => {
    it.todo('returns no annotation');
  });
});
