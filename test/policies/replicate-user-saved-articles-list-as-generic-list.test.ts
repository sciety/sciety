import * as TE from 'fp-ts/TaskEither';
import {
  userFoundReviewHelpful,
  userSavedArticle,
  userUnsavedArticle,
} from '../../src/domain-events';
import { Ports, replicateUserSavedArticlesListAsGenericList } from '../../src/policies/replicate-user-saved-articles-list-as-generic-list';
import { dummyLogger } from '../dummy-logger';
import { arbitraryDate, arbitraryNumber, arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryCommandResult } from '../types/command-result.helper';
import { arbitraryDataError } from '../types/data-error.helper';
import { arbitraryErrorMessage } from '../types/error-message.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const arbitraryList = () => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  articleCount: arbitraryNumber(0, 100),
  lastUpdated: arbitraryDate(),
  ownerId: arbitraryListOwnerId(),
});

describe('replicate-user-saved-articles-list-as-generic-list', () => {
  const userId = arbitraryUserId();
  const articleId = arbitraryArticleId();
  const genericListOwnedByUser = arbitraryList();

  const happyPathAdapters = {
    addArticleToList: () => TE.right(arbitraryCommandResult()),
    removeArticleFromList: () => TE.right(arbitraryCommandResult()),
    logger: dummyLogger,
    getListsOwnedBy: () => TE.right([genericListOwnedByUser]),
  };

  let adapters: Ports;

  describe.each([
    ['UserSavedArticle',
      userSavedArticle(userId, articleId),
      'addArticleToList' as const],
    ['UserUnsavedArticle',
      userUnsavedArticle(userId, articleId),
      'removeArticleFromList' as const],
  ])('when a %s event is received', (eventName, event, relevantCommand) => {
    describe('and the user has a generic list', () => {
      const addArticleToList = jest.fn(happyPathAdapters.addArticleToList);
      const removeArticleFromList = jest.fn(happyPathAdapters.removeArticleFromList);

      beforeAll(async () => {
        adapters = {
          ...happyPathAdapters,
          addArticleToList,
          removeArticleFromList,
        };
        await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
      });

      it('calls one command once', () => {
        const totalCommandCalls = addArticleToList.mock.calls.length + removeArticleFromList.mock.calls.length;

        expect(totalCommandCalls).toBe(1);
      });

      it('calls the relevant command', () => {
        expect(adapters[relevantCommand]).toHaveBeenCalledWith(expect.anything());
      });

      it('calls the command with the generic list id owned by that user', () => {
        expect(adapters[relevantCommand]).toHaveBeenCalledWith(
          expect.objectContaining({ listId: genericListOwnedByUser.id }),
        );
      });

      it('calls the command with the article id in the event', () => {
        expect(adapters[relevantCommand]).toHaveBeenCalledWith(
          expect.objectContaining({ articleId }),
        );
      });
    });

    describe('and the user has a generic list, but the command fails', () => {
      beforeEach(async () => {
        adapters = {
          ...happyPathAdapters,
          addArticleToList: () => TE.left(arbitraryErrorMessage()),
          removeArticleFromList: () => TE.left(arbitraryErrorMessage()),
          logger: jest.fn(dummyLogger),
        };
        await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
      });

      it('logs an error', () => {
        expect(adapters.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('and the user has a generic list, but the adapter for that information fails', () => {
      beforeEach(async () => {
        adapters = {
          ...happyPathAdapters,
          getListsOwnedBy: () => TE.left(arbitraryDataError()),
          logger: jest.fn(dummyLogger),
        };
        await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
      });

      it('logs an error', () => {
        expect(adapters.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('and the user does not have a generic list', () => {
      beforeEach(async () => {
        adapters = {
          ...happyPathAdapters,
          getListsOwnedBy: () => TE.right([]),
          logger: jest.fn(dummyLogger),
        };
        await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
      });

      it('logs an error', () => {
        expect(adapters.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });
  });

  describe('when any other event is received', () => {
    const event = userFoundReviewHelpful(arbitraryUserId(), arbitraryReviewId());

    beforeEach(async () => {
      adapters = {
        ...happyPathAdapters,
        addArticleToList: jest.fn(happyPathAdapters.addArticleToList),
        removeArticleFromList: jest.fn(happyPathAdapters.removeArticleFromList),
        logger: jest.fn(dummyLogger),
      };
      await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
    });

    it('does not call any command', () => {
      expect(adapters.addArticleToList).not.toHaveBeenCalled();
      expect(adapters.removeArticleFromList).not.toHaveBeenCalled();
    });

    it('does not log', () => {
      expect(adapters.logger).not.toHaveBeenCalled();
    });
  });
});
