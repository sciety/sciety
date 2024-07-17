import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { ArticleId } from '../../../../src/types/article-id';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';
import { addArticle } from '../../../../src/write-side/resources/list/add-article';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper';

describe('add-article', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
          },
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
        ],
        addArticle({
          listId,
          articleId: expressionDoi,
        }),
      );

      it('succeeds, doing nothing', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article is not in the list', () => {
      describe('when no annotation is provided in the command', () => {
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            articleId: expressionDoi,
          }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly one event', () => {
          expect(result).toHaveLength(1);
        });

        it('succeeds, adding the article', () => {
          expect(result[0]).toBeDomainEvent('ArticleAddedToList', {
            articleId: new ArticleId(expressionDoi),
            listId,
          });
        });
      });

      describe('when an annotation is provided in the command', () => {
        const annotation = arbitraryUnsafeUserInput();
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            articleId: expressionDoi,
            annotation,
          }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly two events', () => {
          expect(result).toHaveLength(2);
        });

        it('succeeds, adding the article and creating the annotation', () => {
          expect(result[0]).toBeDomainEvent('ArticleAddedToList', {
            articleId: new ArticleId(expressionDoi),
            listId,
          });
          expect(result[1]).toBeDomainEvent('ArticleInListAnnotated', {
            articleId: new ArticleId(expressionDoi),
            listId,
            content: annotation,
          });
        });
      });

      describe('when an annotation that is too long is provided in the command', () => {
        const annotationTooLong = arbitraryLongUnsafeUserInput(5000);
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            articleId: expressionDoi,
            annotation: annotationTooLong,
          }),
        );

        it('fails', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });

      describe('when an annotation is provided as an empty string in the command', () => {
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            articleId: expressionDoi,
            annotation: toUnsafeUserInput(''),
          }),
        );

        it('fails', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });
  });

  describe('when no list with the given id has ever existed', () => {
    const result = pipe(
      [],
      addArticle({
        listId: arbitraryListId(),
        articleId: arbitraryExpressionDoi(),
      }),
    );

    it('fails', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when a list with the given id existed and was then deleted', () => {
    it.todo('fails with not-found');
  });
});
