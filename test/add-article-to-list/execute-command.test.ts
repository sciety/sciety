import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-article-to-list/execute-command';
import { articleAddedToList, listCreated } from '../../src/domain-events';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        { articleIds: [articleId]},
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
        { articleIds: []},
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

    describe('and the article should have been on the list', () => {
      const backdated = arbitraryDate();

      const result = pipe(
        { articleIds: []},
        executeCommand({
          listId,
          articleId,
        }, backdated),
      );

      it('succeeds and raises a backdated event', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'ArticleAddedToList',
          articleId,
          listId,
          date: backdated,
        })]));
      });
    });
  });
});
