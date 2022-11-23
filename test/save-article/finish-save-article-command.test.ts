import { RouterContext } from '@koa/router';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { userSavedArticle } from '../../src/domain-events';
import { finishSaveArticleCommand } from '../../src/save-article/finish-save-article-command';
import { ListOwnerId } from '../../src/types/list-owner-id';
import { User } from '../../src/types/user';
import { arbitraryDate, arbitraryString, arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('finish-save-article-command', () => {
  const listId = arbitraryListId();
  const selectAllListsOwnedBy = (listOwnerId: ListOwnerId) => [{
    listId,
    ownerId: listOwnerId,
    articleIds: [arbitraryDoi().value],
    lastUpdated: arbitraryDate(),
    name: arbitraryWord(),
    description: arbitraryString(),
  }];

  describe('when the user has not already saved the article', () => {
    it('commits a ArticleAddedToList event', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryArticleId();
      const context = ({
        session: {
          command: 'save-article',
          articleId: articleId.toString(),
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as RouterContext<{ user: User }>;

      const getAllEvents = T.of([]);
      const commitEvents = jest.fn().mockImplementation(() => T.of('events-created' as const));

      await finishSaveArticleCommand({ getAllEvents, commitEvents, selectAllListsOwnedBy })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        type: 'ArticleAddedToList',
        listId,
        articleId,
      })]);
    });
  });

  describe('when the user has already saved the article', () => {
    it.failing('does not commit any events', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryArticleId();
      const context = ({
        session: {
          command: 'save-article',
          articleId: articleId.toString(),
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as RouterContext<{ user: User }>;

      const getAllEvents = T.of([
        userSavedArticle(userId, articleId),
      ]);
      const commitEvents = jest.fn().mockImplementation(() => T.of('no-events-created' as const));

      await finishSaveArticleCommand({ getAllEvents, commitEvents, selectAllListsOwnedBy })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([]);
    });
  });

  describe('after saving', () => {
    it('deletes session parameters', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryArticleId();
      const context = ({
        session: {
          command: 'save-article',
          articleId: articleId.toString(),
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as ParameterizedContext;

      await finishSaveArticleCommand({
        commitEvents: () => T.of('no-events-created' as const),
        getAllEvents: async () => [],
        selectAllListsOwnedBy,
      })(context, jest.fn());

      expect(context.session).toStrictEqual({});
    });
  });
});
