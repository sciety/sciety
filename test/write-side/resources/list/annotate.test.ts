import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ArticleId } from '../../../../src/types/article-id';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';
import { AnnotateArticleInListCommand } from '../../../../src/write-side/commands';
import { annotate } from '../../../../src/write-side/resources/list';
import {
  arbitraryListCreatedEvent,
  arbitraryArticleAddedToListEvent,
  arbitraryArticleInListAnnotatedEvent,
  arbitraryArticleRemovedFromListEvent,
} from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper';

describe('annotate', () => {
  const expressionDoi = arbitraryExpressionDoi();
  const listId = arbitraryListId();
  const content = arbitraryUnsafeUserInput();
  const annotateArticleInListCommand: AnnotateArticleInListCommand = {
    annotationContent: content,
    articleId: new ArticleId(expressionDoi),
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
        articleId: new ArticleId(expressionDoi),
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
            annotationContent: toUnsafeUserInput(''),
            articleId: new ArticleId(expressionDoi),
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
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly one event', () => {
          expect(result).toHaveLength(1);
        });

        it('succeeds, raising a relevant event', () => {
          expect(result[0]).toBeDomainEvent('ArticleInListAnnotated', {
            articleId: new ArticleId(expressionDoi),
            listId,
            content,
          });
        });
      });

      describe('when the annotation is too long', () => {
        const result = pipe(
          relevantEvents,
          annotate({
            annotationContent: arbitraryLongUnsafeUserInput(5000),
            articleId: new ArticleId(expressionDoi),
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
          articleId: new ArticleId(expressionDoi),
          listId,
        },
        {
          ...arbitraryArticleInListAnnotatedEvent(),
          articleId: new ArticleId(expressionDoi),
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
            articleId: new ArticleId(expressionDoi),
            listId,
          },
          {
            ...arbitraryArticleRemovedFromListEvent(),
            articleId: new ArticleId(expressionDoi),
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

  describe('when the list has never existed', () => {
    const result = pipe(
      [],
      annotate(annotateArticleInListCommand),
    );

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the list existed and was then deleted', () => {
    it.todo('fails');
  });
});
