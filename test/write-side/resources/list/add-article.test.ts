import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';
import { constructEvent } from '../../../../src/domain-events';
import { addArticle } from '../../../../src/write-side/resources/list/add-article';
import { arbitraryString } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitrarySanitisedUserInput } from '../../../types/sanitised-user-input.helper';

describe('add-article', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        [
          constructEvent('ListCreated')({
            listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
          }),
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
            constructEvent('ListCreated')({
              listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
            }),
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
        const annotation = arbitrarySanitisedUserInput();
        const result = pipe(
          [
            constructEvent('ListCreated')({
              listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
            }),
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
    });
  });
});
