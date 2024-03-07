import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events';
import { addArticle } from '../../../../src/write-side/resources/list/add-article';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('add-article', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
          },
          constructEvent('ArticleAddedToList')({ articleId, listId }),
        ],
        addArticle({
          listId,
          articleId,
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
            articleId,
          }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly one event', () => {
          expect(result).toHaveLength(1);
        });

        it('succeeds, adding the article', () => {
          expect(result[0]).toBeDomainEvent('ArticleAddedToList', {
            articleId,
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
            articleId,
            annotation,
          }),
          E.getOrElseW(shouldNotBeCalled),
        );

        it('raises exactly two events', () => {
          expect(result).toHaveLength(2);
        });

        it('succeeds, adding the article and creating the annotation', () => {
          expect(result[0]).toBeDomainEvent('ArticleAddedToList', {
            articleId,
            listId,
          });
          expect(result[1]).toBeDomainEvent('ArticleInListAnnotated', {
            articleId,
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
            articleId,
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
            articleId,
            annotation: toUnsafeUserInput(''),
          }),
        );

        it('fails', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });
  });
});
