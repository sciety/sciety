import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, isUserSavedArticleEvent, userSavedArticle, UserSavedArticleEvent, userUnsavedArticle,
} from '../../src/domain-events';
import { AddArticleToList, GetListsOwnedBy, Logger } from '../../src/shared-ports';
import * as DE from '../../src/types/data-error';
import * as LOID from '../../src/types/list-owner-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryList } from '../group-page/about/to-our-lists-view-model.test';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

type Ports = {
  addArticleToList: AddArticleToList,
  getListsOwnedBy: GetListsOwnedBy,
  logger: Logger,
};

type AddArticleToGenericListFromUserSavedArticle = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

const toCommand = (ports: Ports) => (event: UserSavedArticleEvent) => pipe(
  event.userId,
  LOID.fromUserId,
  ports.getListsOwnedBy,
  TE.map((lists) => ({ articleId: event.articleId, listId: lists[0].id })),
);

const addArticleToGenericListFromUserSavedArticle: AddArticleToGenericListFromUserSavedArticle = (
  ports,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'not interesting'),
  TE.chainW(toCommand(ports)),
  TE.chain(ports.addArticleToList),
  TE.match(
    (reason) => {
      ports.logger('error', 'addArticleToGenericListFromUserSavedArticle policy failed', { reason, event });
      return undefined;
    },
    () => undefined,
  ),
);

describe('add-article-to-generic-list-from-user-saved-article', () => {
  const defaultPorts = {
    addArticleToList: () => TE.right(undefined),
    logger: dummyLogger,
    getListsOwnedBy: () => TE.right([]),
  };

  let ports: Ports;

  describe('when a UserSavedArticle event is received', () => {
    describe('and the user has a generic list', () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryArticleId();
      const genericListOwnedByUser = arbitraryList();

      const event = userSavedArticle(userId, articleId);

      beforeEach(async () => {
        ports = {
          addArticleToList: jest.fn(defaultPorts.addArticleToList),
          getListsOwnedBy: () => TE.right([genericListOwnedByUser]),
          logger: dummyLogger,
        };
        await addArticleToGenericListFromUserSavedArticle(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(expect.anything());
      });

      it('calls the command with the generic list id owned by that user', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(
          expect.objectContaining({ listId: genericListOwnedByUser.id }),
        );
      });

      it('calls the command with the article id in the UserSavedArticle event', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(
          expect.objectContaining({ articleId }),
        );
      });
    });

    describe('and the user has a generic list, but the command fails', () => {
      const genericListOwnedByUser = arbitraryList();
      const event = userSavedArticle(arbitraryUserId(), arbitraryArticleId());

      beforeEach(async () => {
        ports = {
          addArticleToList: () => TE.left(DE.unavailable),
          getListsOwnedBy: () => TE.right([genericListOwnedByUser]),
          logger: jest.fn(dummyLogger),
        };
        await addArticleToGenericListFromUserSavedArticle(ports)(event)();
      });

      it('logs an error', () => {
        expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('and the user has a generic list, but the adapter for that information fails', () => {
      const event = userSavedArticle(arbitraryUserId(), arbitraryArticleId());

      beforeEach(async () => {
        ports = {
          addArticleToList: defaultPorts.addArticleToList,
          getListsOwnedBy: () => TE.left(DE.unavailable),
          logger: jest.fn(dummyLogger),
        };
        await addArticleToGenericListFromUserSavedArticle(ports)(event)();
      });

      it('logs an error', () => {
        expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
      });
    });

    describe('and the user does not have a generic list', () => {
      it.todo('logs an error');
    });
  });

  describe('when any other event is received', () => {
    const event = userUnsavedArticle(arbitraryUserId(), arbitraryArticleId());
    const adapters = {
      ...defaultPorts,
      addArticleToList: jest.fn(defaultPorts.addArticleToList),

    };

    beforeEach(async () => {
      await addArticleToGenericListFromUserSavedArticle(adapters)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(adapters.addArticleToList).not.toHaveBeenCalled();
    });
  });
});
