import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, isUserSavedArticleEvent, userFoundReviewHelpful, userSavedArticle, UserSavedArticleEvent,
} from '../../src/domain-events';
import { AddArticleToList, GetListsOwnedBy, Logger } from '../../src/shared-ports';
import * as LOID from '../../src/types/list-owner-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryList } from '../group-page/about/to-our-lists-view-model.test';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryDataError } from '../types/data-error.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

type RemoveArticleFromList = () => TE.TaskEither<string, void>;

type Ports = {
  addArticleToList: AddArticleToList,
  removeArticleFromList: RemoveArticleFromList,
  getListsOwnedBy: GetListsOwnedBy,
  logger: Logger,
};

type ReplicateUserSavedArticleListAsGenericList = (adapters: Ports) => (event: DomainEvent) => T.Task<undefined>;

const toCommand = (adapters: Ports) => (event: UserSavedArticleEvent) => pipe(
  event.userId,
  LOID.fromUserId,
  adapters.getListsOwnedBy,
  TE.map(RA.head),
  TE.chainW(TE.fromOption(() => 'user has no generic list' as const)),
  TE.map((list) => ({
    articleId: event.articleId,
    listId: list.id,
  })),
);

const replicateUserSavedArticlesListAsGenericList: ReplicateUserSavedArticleListAsGenericList = (
  adapters,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'not interesting'),
  TE.chainW(toCommand(adapters)),
  TE.chain(adapters.addArticleToList),
  TE.match(
    (reason) => {
      adapters.logger('error', 'replicateUserSavedArticlesListAsGenericList policy failed', { reason, event });
      return undefined;
    },
    () => undefined,
  ),
);

describe('replicate-user-saved-articles-list-as-generic-list', () => {
  const userId = arbitraryUserId();
  const articleId = arbitraryArticleId();
  const genericListOwnedByUser = arbitraryList();

  const happyPathAdapters = {
    addArticleToList: () => TE.right(undefined),
    removeArticleFromList: () => TE.right(undefined),
    logger: dummyLogger,
    getListsOwnedBy: () => TE.right([genericListOwnedByUser]),
  };

  let adapters: Ports;

  describe.each([
    ['UserSavedArticle',
      userSavedArticle(userId, articleId),
      'addArticleToList' as const],
  ])('when a %s event is received', (eventName, event, relevantCommand) => {
    describe('and the user has a generic list', () => {
      beforeEach(async () => {
        adapters = {
          ...happyPathAdapters,
          addArticleToList: jest.fn(happyPathAdapters.addArticleToList),
        };
        await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
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
          addArticleToList: () => TE.left(arbitraryDataError()),
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
      };
      await replicateUserSavedArticlesListAsGenericList(adapters)(event)();
    });

    it('does not call any command', () => {
      expect(adapters.addArticleToList).not.toHaveBeenCalled();
      expect(adapters.removeArticleFromList).not.toHaveBeenCalled();
    });
  });
});
