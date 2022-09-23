import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-article-to-list/execute-command';
import { arbitraryDate } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        { articleIds: [articleId] },
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
        { articleIds: [] },
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

    describe('and the article should have been on the list', () => {
      const backdated = arbitraryDate();

      const result = pipe(
        { articleIds: [] },
        executeCommand({
          listId,
          articleId,
        }, backdated),
      );

      it('succeeds and raises a backdated event', () => {
        expect(result).toStrictEqual([expect.objectContaining({
          type: 'ArticleAddedToList',
          articleId,
          listId,
          date: backdated,
        })]);
      });
    });
  });
});
