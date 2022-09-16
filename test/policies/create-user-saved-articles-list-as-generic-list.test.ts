import * as TE from 'fp-ts/TaskEither';
import {
  userFoundReviewHelpful, userSavedArticle,
} from '../../src/domain-events';
import { createUserSavedArticlesListAsGenericList, Ports } from '../../src/policies/create-user-saved-articles-list-as-generic-list';
import * as LOID from '../../src/types/list-owner-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('create-user-saved-articles-list-as-generic-list', () => {
  const defaultPorts = {
    createList: () => TE.right(undefined),
    getUserDetails: () => TE.right({ handle: arbitraryWord() }),
    getListsOwnedBy: () => TE.right([]),
    logger: dummyLogger,
  };
  let ports: Ports;

  describe('when a UserSavedArticle event is received', () => {
    const userId = arbitraryUserId();
    const handle = arbitraryWord();
    const event = userSavedArticle(userId, arbitraryArticleId());

    describe('and that user owns no generic list', () => {
      describe('if the command succeeds', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            createList: jest.fn(defaultPorts.createList),
            getUserDetails: () => TE.right({ handle }),
            getListsOwnedBy: () => TE.right([]),
          };
          await createUserSavedArticlesListAsGenericList(ports)(event)();
        });

        it('calls the CreateList command', () => {
          expect(ports.createList).toHaveBeenCalledWith(expect.anything());
        });

        it('calls the command with the user as the owner', () => {
          expect(ports.createList).toHaveBeenCalledWith(expect.objectContaining({
            ownerId: LOID.fromUserId(userId),
          }));
        });

        it('calls the command with "@{handle}\'s saved articles" as a name', () => {
          expect(ports.createList).toHaveBeenCalledWith(expect.objectContaining({
            name: `@${handle}'s saved articles`,
          }));
        });

        it('calls the command with "Articles that have been saved by @{handle}" as a description', () => {
          expect(ports.createList).toHaveBeenCalledWith(expect.objectContaining({
            description: `Articles that have been saved by @${handle}`,
          }));
        });
      });

      describe('if the command fails', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            createList: () => TE.left(undefined),
            logger: jest.fn(dummyLogger),
          };
          await createUserSavedArticlesListAsGenericList(ports)(event)();
        });

        it('logs an error', () => {
          expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
        });
      });

      describe('if getListsOwnedBy fails', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            getListsOwnedBy: () => TE.left(undefined),
            logger: jest.fn(dummyLogger),
          };
          await createUserSavedArticlesListAsGenericList(ports)(event)();
        });

        it('logs an error', () => {
          expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
        });
      });

      describe('if getUserDetails fails', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            getUserDetails: () => TE.left(undefined),
            logger: jest.fn(dummyLogger),
          };
          await createUserSavedArticlesListAsGenericList(ports)(event)();
        });

        it('logs an error', () => {
          expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
        });
      });
    });

    describe('and the user already owns a generic list', () => {
      beforeEach(async () => {
        ports = {
          ...defaultPorts,
          createList: jest.fn(defaultPorts.createList),
          getListsOwnedBy: () => TE.right([{ id: arbitraryListId() }]),
          logger: jest.fn(dummyLogger),
        };
        await createUserSavedArticlesListAsGenericList(ports)(event)();
      });

      it('does not call the CreateList command', () => {
        expect(ports.createList).not.toHaveBeenCalled();
      });

      it('logs a debug message', () => {
        expect(ports.logger).toHaveBeenCalledWith('debug', expect.anything(), expect.anything());
      });
    });
  });

  describe('when any other event is received', () => {
    const event = userFoundReviewHelpful(arbitraryUserId(), arbitraryReviewId());

    beforeEach(async () => {
      ports = {
        ...defaultPorts,
        createList: jest.fn(defaultPorts.createList),
        logger: jest.fn(dummyLogger),
      };
      await createUserSavedArticlesListAsGenericList(ports)(event)();
    });

    it('does not call the CreateList command', () => {
      expect(ports.createList).not.toHaveBeenCalled();
    });

    it('does not log', () => {
      expect(ports.logger).not.toHaveBeenCalled();
    });
  });
});
