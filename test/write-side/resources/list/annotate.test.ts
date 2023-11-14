import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { annotate } from '../../../../src/write-side/resources/list';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import {
  arbitraryListCreatedEvent,
  arbitraryArticleAddedToListEvent,
  arbitraryArticleInListAnnotatedEvent,
  arbitraryArticleRemovedFromListEvent,
} from '../../../domain-events/list-resource-events.helper';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';

describe('annotate', () => {
  const articleId = arbitraryArticleId();
  const listId = arbitraryListId();
  const content = arbitraryUnsafeUserInput();
  const annotateArticleInListCommand = {
    content,
    articleId,
    listId,
  };

  describe('when the list exists', () => {
    const listCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listId,
    };

    describe('and the article is in the list without an annotation', () => {
      const articleAddedToListEvent = {
        ...arbitraryArticleAddedToListEvent(),
        articleId,
        listId,
      };

      const relevantEvents = [
        listCreatedEvent,
        articleAddedToListEvent,
      ];

      describe('when the annotation is an empty string', () => {
        const result = pipe(
          relevantEvents,
          annotate({
            content: toUnsafeUserInput(''),
            articleId,
            listId,
          }),
        );

        it('fails', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });

      describe('when the annotation is of an acceptable length', () => {
        const result = pipe(
          relevantEvents,
          annotate(annotateArticleInListCommand),
        );

        it('succeeds, raising a relevant event', () => {
          expect(result).toStrictEqual(E.right([expect.objectContaining({
            type: 'ArticleInListAnnotated',
            articleId,
            listId,
            content,
          })]));
        });
      });

      describe('when the annotation is too long', () => {
        const result = pipe(
          relevantEvents,
          annotate({
            content: arbitraryLongUnsafeUserInput(5000),
            articleId,
            listId,
          }),
        );

        it('fails', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });

    describe('and the article is in the list with an annotation', () => {
      const relevantEvents = [
        listCreatedEvent,
        {
          ...arbitraryArticleAddedToListEvent(),
          articleId,
          listId,
        },
        {
          ...arbitraryArticleInListAnnotatedEvent(),
          articleId,
          listId,
        },
      ];
      const result = pipe(
        relevantEvents,
        annotate(annotateArticleInListCommand),
      );

      it('succeeds, without raising any event', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article is not in the list', () => {
      const result = pipe(
        [
          listCreatedEvent,
        ],
        annotate(annotateArticleInListCommand),
      );

      it('fails', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('and the article has been added to the list and then removed', () => {
      const result = pipe(
        [
          listCreatedEvent,
          {
            ...arbitraryArticleAddedToListEvent(),
            articleId,
            listId,
          },
          {
            ...arbitraryArticleRemovedFromListEvent(),
            articleId,
            listId,
          },
        ],
        annotate(annotateArticleInListCommand),
      );

      it('fails', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [],
      annotate(annotateArticleInListCommand),
    );

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
