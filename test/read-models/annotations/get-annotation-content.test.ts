import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { notSafeToRender, handleEvent, initialState } from '../../../src/read-models/annotations/handle-event';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { constructEvent } from '../../../src/domain-events';
import { getAnnotationContent } from '../../../src/read-models/annotations/get-annotation-content';
import { arbitraryUnsafeUserInput } from '../../types/unsafe-user-input.helper';

describe('get-annotation-content', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();
  const content = arbitraryUnsafeUserInput();

  describe('when the article has been annotated in the list', () => {
    const readmodel = pipe(
      [
        constructEvent('ArticleInListAnnotated')({ listId, articleId, content }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the annotation content', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.some(notSafeToRender(content)));
    });
  });

  describe('when the article has been annotated in a different list', () => {
    const readmodel = pipe(
      [
        constructEvent('ArticleInListAnnotated')({ listId: arbitraryListId(), articleId, content }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.none);
    });
  });

  describe('when a different article has been annotated in the list', () => {
    const readmodel = pipe(
      [
        constructEvent('ArticleInListAnnotated')({ listId, articleId: arbitraryArticleId(), content }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.none);
    });
  });

  describe('when there have been no annotations', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.none);
    });
  });

  describe('an annotated article has been removed from its list', () => {
    const readmodel = pipe(
      [
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleInListAnnotated')({ articleId, listId, content }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.none);
    });
  });

  describe('an annotated article has been removed from its list and then re-added', () => {
    const readmodel = pipe(
      [
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleInListAnnotated')({ articleId, listId, content }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns no annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.none);
    });
  });

  describe('an annotated article was removed from its list, re-added and re-annotated', () => {
    const newContent = arbitraryUnsafeUserInput();
    const readmodel = pipe(
      [
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleInListAnnotated')({ articleId, listId, content }),
        constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        constructEvent('ArticleAddedToList')({ articleId, listId }),
        constructEvent('ArticleInListAnnotated')({ articleId, listId, content: newContent }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns only the new annotation', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.some(notSafeToRender(newContent)));
    });
  });
});
