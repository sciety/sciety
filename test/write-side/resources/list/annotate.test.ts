import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { ArticleId } from '../../../../src/types/article-id';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';
import { AnnotateArticleInListCommand } from '../../../../src/write-side/commands';
import { annotate } from '../../../../src/write-side/resources/list';
import {
  arbitraryListCreatedEvent,
  arbitraryArticleAddedToListEvent,
  arbitraryArticleInListAnnotatedEvent,
  arbitraryArticleRemovedFromListEvent,
  arbitraryListDeletedEvent,
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
    expressionDoi,
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
            expressionDoi,
            listId,
          }),
        );

        it('rejects the command', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });

      describe('when the annotation is of an acceptable length', () => {
        let result: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          result = pipe(
            relevantEvents,
            annotate(annotateArticleInListCommand),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('causes a state change in which the article is annotated', () => {
          expect(result).toHaveLength(1);
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
            expressionDoi,
            listId,
          }),
        );

        it('rejects the command', () => {
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

      it('accepts the command and causes no state change', () => {
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

      it('rejects the command with "Article not in list"', () => {
        expect(result).toStrictEqual(E.left('Article not in list'));
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

      it('rejects the command with "Article not in list"', () => {
        expect(result).toStrictEqual(E.left('Article not in list'));
      });
    });
  });

  describe('when the list has never existed', () => {
    const result = pipe(
      [],
      annotate(annotateArticleInListCommand),
    );

    it('rejects the command with "not found"', () => {
      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when the list existed and was then deleted', () => {
    const result = pipe(
      [
        {
          ...arbitraryListCreatedEvent(),
          listId,
        },
        {
          ...arbitraryArticleAddedToListEvent(),
          articleId: new ArticleId(expressionDoi),
          listId,
        },
        {
          ...arbitraryListDeletedEvent(),
          listId,
        },
      ],
      annotate(annotateArticleInListCommand),
    );

    it('rejects the command with "not found"', () => {
      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});
