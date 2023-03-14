import { RouterContext } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { articleIdFieldName, saveArticleHandler } from '../../../src/write-side/save-article/save-article-handler';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryDate, arbitraryString, arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryCommandResult } from '../../types/command-result.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryErrorMessage } from '../../types/error-message.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { GetList, SelectAllListsOwnedBy } from '../../../src/shared-ports';
import { UserId } from '../../../src/types/user-id';
import * as LOID from '../../../src/types/list-owner-id';

describe('save-article-handler', () => {
  const listId = arbitraryListId();
  const user = arbitraryUserDetails();
  const userId = user.id;
  const selectAllListsOwnedBy: SelectAllListsOwnedBy = () => [{
    id: listId,
    ownerId: LOID.fromUserId(userId),
    articleIds: [arbitraryDoi().value],
    lastUpdated: arbitraryDate(),
    name: arbitraryWord(),
    description: arbitraryString(),
  }];
  const getList: GetList = () => O.some({
    id: listId,
    ownerId: LOID.fromUserId(userId),
    articleIds: [arbitraryDoi().value],
    lastUpdated: arbitraryDate(),
    name: arbitraryWord(),
    description: arbitraryString(),
  });

  describe('when the user tried to save an article and the command handler fails', () => {
    const addArticleToList = () => TE.left(arbitraryErrorMessage());
    const articleId = arbitraryArticleId();
    const context = ({
      request: {
        body: {
          [articleIdFieldName]: articleId.toString(),
        },
      },
      state: {
        user: {
          id: userId,
        },
      },
    } as unknown) as RouterContext<{ user: { id: UserId } }>;

    const logger = jest.fn(dummyLogger);

    it('logs an error', async () => {
      await saveArticleHandler({
        lookupUser: () => O.some(user),
        selectAllListsOwnedBy,
        addArticleToList,
        logger,
        getList,
      })(context, jest.fn());

      expect(logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
    });
  });

  describe('when the user tries to save an article', () => {
    const addArticleToList = jest.fn(() => TE.right(arbitraryCommandResult()));
    const articleId = arbitraryArticleId();
    const context = ({
      request: {
        body: {
          [articleIdFieldName]: articleId.toString(),
        },
      },
      state: {
        user: {
          id: userId,
        },
      },
    } as unknown) as RouterContext<{ user: { id: UserId } }>;

    it('calls the add article to list command with the list id owned by the user', async () => {
      await saveArticleHandler({
        selectAllListsOwnedBy,
        lookupUser: () => O.some(user),
        addArticleToList,
        logger: dummyLogger,
        getList,
      })(context, jest.fn());

      expect(addArticleToList).toHaveBeenCalledWith(expect.objectContaining({ listId, articleId }));
    });
  });
});
