import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../../src/domain-events/index.js';
import { addArticle } from '../../../../src/write-side/resources/list/add-article.js';
import { arbitraryArticleId } from '../../../types/article-id.helper.js';
import { arbitraryListId } from '../../../types/list-id.helper.js';
import { arbitraryListCreatedEvent } from '../../../domain-events/list-resource-events.helper.js';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input.js';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper.js';

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
        );

        it('succeeds, adding the article', () => {
          expect(result).toStrictEqual(E.right([expect.objectContaining({
            type: 'ArticleAddedToList',
            articleId,
            listId,
          })]));
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
        );

        it('succeeds, adding the article and creating the annotation', () => {
          expect(result).toStrictEqual(E.right([
            expect.objectContaining({
              type: 'ArticleAddedToList',
              articleId,
              listId,
            }),
            expect.objectContaining({
              type: 'ArticleInListAnnotated',
              articleId,
              listId,
              content: annotation,
            }),
          ]));
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
