import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/remove-article-from-list/execute-command';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('the article is in the list', () => {
    const result = pipe(
      { articleIds: [articleId] },
      executeCommand({
        listId,
        articleId,
      }),
    );

    it.failing('succeeds and raises an event', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        type: 'ArticleRemovedFromList',
        articleId,
        listId,
      })]);
    });
  });

  describe('the article is not in the list', () => {
    const result = pipe(
      { articleIds: [] },
      executeCommand({
        listId,
        articleId,
      }),
    );

    it('succeeds and raises no events', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
