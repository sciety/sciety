import { RouterContext } from '@koa/router';
import * as TE from 'fp-ts/TaskEither';
import { ParameterizedContext } from 'koa';
import { finishSaveArticleCommand } from '../../src/save-article/finish-save-article-command';
import { ListOwnerId } from '../../src/types/list-owner-id';
import { User } from '../../src/types/user';
import { dummyLogger } from '../dummy-logger';
import { arbitraryDate, arbitraryString, arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryCommandResult } from '../types/command-result.helper';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryErrorMessage } from '../types/error-message.helper';
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

  describe('when the user tried to save an article and the command handler fails', () => {
    const addArticleToList = () => TE.left(arbitraryErrorMessage());
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

    const logger = jest.fn(dummyLogger);

    it('logs an error', async () => {
      await finishSaveArticleCommand({
        selectAllListsOwnedBy,
        addArticleToList,
        logger,
      })(context, jest.fn());

      expect(logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
    });
  });

  describe('when the user tries to save an article', () => {
    const addArticleToList = jest.fn(() => TE.right(arbitraryCommandResult()));
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

    it('calls the add article to list command with the list id owned by the user', async () => {
      await finishSaveArticleCommand({
        selectAllListsOwnedBy,
        addArticleToList,
        logger: dummyLogger,
      })(context, jest.fn());

      expect(addArticleToList).toHaveBeenCalledWith(expect.objectContaining({ listId, articleId }));
    });
  });

  describe('after saving', () => {
    const addArticleToList = () => TE.right(arbitraryCommandResult());

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
        selectAllListsOwnedBy,
        addArticleToList,
        logger: dummyLogger,
      })(context, jest.fn());

      expect(context.session).toStrictEqual({});
    });
  });
});
