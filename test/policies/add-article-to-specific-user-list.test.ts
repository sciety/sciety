import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle, userUnsavedArticle } from '../../src/domain-events';
import { addArticleToSpecificUserList, Ports, specificUserListId } from '../../src/policies/add-article-to-specific-user-list';
import { toErrorMessage } from '../../src/types/error-message';
import { toUserId } from '../../src/types/user-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryCommandResult } from '../types/command-result.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('add-article-to-specific-user-list', () => {
  const defaultPorts = {
    addArticleToList: () => TE.right(arbitraryCommandResult()),
    logger: dummyLogger,
  };

  describe('when a UserSavedArticle event is received', () => {
    describe('when the user is David Ashbrook', () => {
      let ports: Ports;

      const userId = toUserId('931653361');
      const articleId = arbitraryArticleId();

      const event = userSavedArticle(userId, articleId);

      describe('a successful call to the addArticleToList port', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            addArticleToList: jest.fn(defaultPorts.addArticleToList),
          };
          await addArticleToSpecificUserList(ports)(event)();
        });

        it('calls the AddArticleToList command', () => {
          expect(ports.addArticleToList).toHaveBeenCalledWith(expect.anything());
        });

        it('call the command with the article id coming from the event', () => {
          expect(ports.addArticleToList).toHaveBeenCalledWith(expect.objectContaining({ articleId }));
        });

        it('call the command with the list id for David Ashbrook', () => {
          expect(ports.addArticleToList).toHaveBeenCalledWith(
            expect.objectContaining({ listId: specificUserListId }),
          );
        });
      });

      describe('an unsuccessful call to the addArticleToList port', () => {
        beforeEach(async () => {
          ports = {
            addArticleToList: () => TE.left(toErrorMessage(arbitraryString())),
            logger: jest.fn(dummyLogger),
          };
          await addArticleToSpecificUserList(ports)(event)();
        });

        it('logs an error level message', () => {
          expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
        });
      });
    });

    describe('when the user is not David Ashbrook', () => {
      const ports = {
        ...defaultPorts,
        addArticleToList: jest.fn(defaultPorts.addArticleToList),
      };

      const userId = toUserId('not-david-ashbrook');

      const event = userSavedArticle(userId, arbitraryArticleId());

      beforeEach(async () => {
        await addArticleToSpecificUserList(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.addArticleToList).not.toHaveBeenCalled();
      });
    });
  });

  describe('when any other event is received', () => {
    const ports = {
      ...defaultPorts,
      addArticleToList: jest.fn(defaultPorts.addArticleToList),
    };

    const event = userUnsavedArticle(arbitraryUserId(), arbitraryArticleId());

    beforeEach(async () => {
      await addArticleToSpecificUserList(ports)(event)();
    });

    it('does not call the AddArticleToList command', () => {
      expect(ports.addArticleToList).not.toHaveBeenCalled();
    });
  });
});
