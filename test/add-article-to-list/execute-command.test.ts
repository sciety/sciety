import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-article-to-list/execute-command';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        { articleIds: [articleId], name: arbitraryString(), description: arbitraryString() },
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds with no events raised', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('and the article is not in the list', () => {
      const result = pipe(
        { articleIds: [], name: arbitraryString(), description: arbitraryString() },
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds and raises an event', () => {
        expect(result).toStrictEqual([expect.objectContaining({
          type: 'ArticleAddedToList',
          articleId,
          listId,
        })]);
      });
    });
  });
});
