import { RouterContext } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { articleIdFieldName, saveArticleHandler } from '../../../src/write-side/save-article/save-article-handler';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryCommandResult } from '../../types/command-result.helper';
import { arbitraryErrorMessage } from '../../types/error-message.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { UserId } from '../../../src/types/user-id';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryList } from '../../types/list-helper';
import { Queries } from '../../../src/shared-read-models';

describe('save-article-handler', () => {
  const listId = arbitraryListId();
  const user = arbitraryUserDetails();
  const userId = user.id;
  const articleId = arbitraryArticleId();
  const context = ({
    request: {
      body: {
        [articleIdFieldName]: articleId.toString(),
        listId,
      },
    },
    state: {
      user: {
        id: userId,
      },
    },
  } as unknown) as RouterContext<{ user: { id: UserId } }>;

  describe('when the user is the owner of the list', () => {
    const lookupList: Queries['lookupList'] = () => O.some({
      ...arbitraryList(LOID.fromUserId(userId)),
      id: listId,
    });

    describe('when the user tried to save an article and the command handler fails', () => {
      const addArticleToList = () => TE.left(arbitraryErrorMessage());
      const logger = jest.fn(dummyLogger);

      it('logs an error', async () => {
        await saveArticleHandler({
          lookupUser: () => O.some(user),
          addArticleToList,
          logger,
          lookupList,
        })(context, jest.fn());

        expect(logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('when the user tries to save an article', () => {
      const addArticleToList = jest.fn(() => TE.right(arbitraryCommandResult()));

      it('calls the add article to list command with the list id owned by the user', async () => {
        await saveArticleHandler({
          lookupUser: () => O.some(user),
          addArticleToList,
          logger: dummyLogger,
          lookupList,
        })(context, jest.fn());

        expect(addArticleToList).toHaveBeenCalledWith(expect.objectContaining({ listId, articleId }));
      });
    });
  });

  describe('when the user is not the owner of the list', () => {
    const lookupList: Queries['lookupList'] = () => O.some(arbitraryList());

    describe('when the user tries to save an article', () => {
      const addArticleToList = () => TE.right(arbitraryCommandResult());

      const logger = jest.fn(dummyLogger);

      it('logs an error', async () => {
        await saveArticleHandler({
          lookupUser: () => O.some(user),
          addArticleToList,
          logger,
          lookupList,
        })(context, jest.fn());

        expect(logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });
  });
});
