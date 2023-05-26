import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { constructEvent } from '../../../src/domain-events';
import { executeCommand } from '../../../src/write-side/add-article-to-list/execute-command';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('execute-command', () => {
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
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds with no events raised', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article is not in the list', () => {
      const result = pipe(
        [
          constructEvent('ListCreated')({
            listId, name: arbitraryString(), description: arbitraryString(), ownerId: arbitraryListOwnerId(),
          }),
        ],
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds and raises an event', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'ArticleAddedToList',
          articleId,
          listId,
        })]));
      });
    });
  });
});
