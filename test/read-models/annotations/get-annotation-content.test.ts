import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { getAnnotationContent } from '../../../src/read-models/annotations/get-annotation-content';
import { handleEvent, initialState } from '../../../src/read-models/annotations/handle-event';
import { rawUserInput } from '../../../src/read-side';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUnsafeUserInput } from '../../types/unsafe-user-input.helper';

describe('get-annotation-content', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();
  const content = arbitraryUnsafeUserInput();

  describe('when the list exists', () => {
    describe('when the article has been annotated in the list', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleInListAnnotated')({ listId, articleId: new ArticleId(expressionDoi), content }),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const annotationContent = getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi));

      it('returns the annotation content', () => {
        expect(annotationContent).toStrictEqual(O.some(rawUserInput(content)));
      });
    });

    describe('when the article has been annotated in a different list', () => {
      const readmodel = pipe(
        [
          constructEvent('ArticleInListAnnotated')({ listId: arbitraryListId(), articleId: new ArticleId(expressionDoi), content }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns no annotation', () => {
        expect(getAnnotationContent(readmodel)(listId, new ArticleId(expressionDoi))).toStrictEqual(O.none);
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

  describe('when the list has never existed', () => {
    it.todo('returns no annotation');
  });

  describe('when the list has been deleted', () => {
    it.todo('returns no annotation');
  });
});
