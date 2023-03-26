import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { annotationCreated } from '../../../src/domain-events';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryString } from '../../helpers';
import { handleEvent, initialState } from '../../../src/shared-read-models/annotations';
import { getAnnotationContent } from '../../../src/shared-read-models/annotations/get-annotation-content';

describe('get-annotation-content', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();
  const annotationContent = toHtmlFragment(arbitraryString());

  describe('when the article has been annotated in the list', () => {
    const readmodel = pipe(
      [
        annotationCreated({ listId, articleId }, annotationContent),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns the annotation content as HTML', () => {
      expect(getAnnotationContent(readmodel)(listId, articleId)).toStrictEqual(O.some(annotationContent));
    });
  });

  describe('when the article has been annotated in a different list', () => {
    const readmodel = pipe(
      [
        annotationCreated({ listId: arbitraryListId(), articleId }, annotationContent),
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
        annotationCreated({ listId, articleId: arbitraryArticleId() }, annotationContent),
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
});
