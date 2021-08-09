import { RouterContext } from '@koa/router';
import * as T from 'fp-ts/Task';
import { ParameterizedContext } from 'koa';
import { finishSavedCommand } from '../../src/command/finish-saved-command';
import { encodedCommandFieldName } from '../../src/command/save-command';
import { userSavedArticle } from '../../src/domain-events';
import { CommandFromString } from '../../src/types/command';
import { User } from '../../src/types/user';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('finish-save-article-command', () => {
  describe('when the user has not already saved the article', () => {
    it('commits a UserSavedArticle event', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryDoi();
      const context = ({
        session: {
          [encodedCommandFieldName]: CommandFromString.encode({ articleId, type: 'SaveArticle' }),
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as RouterContext<{ user: User }>;

      const getAllEvents = T.of([]);
      const commitEvents = jest.fn().mockImplementation(() => T.of(undefined));

      await finishSavedCommand({ getAllEvents, commitEvents })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([expect.objectContaining({
        type: 'UserSavedArticle',
        userId,
        articleId,
      })]);
    });
  });

  describe('when the user has already saved the article', () => {
    it('does not commit any events', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryDoi();
      const context = ({
        session: {
          [encodedCommandFieldName]: CommandFromString.encode({ articleId, type: 'SaveArticle' }),
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
      const commitEvents = jest.fn().mockImplementation(() => T.of(undefined));

      await finishSavedCommand({ getAllEvents, commitEvents })(context, jest.fn());

      expect(commitEvents).toHaveBeenCalledWith([]);
    });
  });

  describe('after saving', () => {
    it('deletes session parameters', async () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryDoi();
      const context = ({
        session: {
          [encodedCommandFieldName]: CommandFromString.encode({ articleId, type: 'SaveArticle' }),
        },
        state: {
          user: {
            id: userId,
          },
        },
      } as unknown) as ParameterizedContext;

      await finishSavedCommand({
        commitEvents: () => T.of(undefined),
        getAllEvents: async () => [],
      })(context, jest.fn());

      expect(context.session).toStrictEqual({});
    });
  });
});
