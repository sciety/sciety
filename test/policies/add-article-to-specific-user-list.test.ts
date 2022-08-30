import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle } from '../../src/domain-events';
import { addArticleToSpecificUserList, Ports, specificUserListId } from '../../src/policies/add-article-to-specific-user-list';
import { toUserId } from '../../src/types/user-id';
import { dummyLogger } from '../dummy-logger';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('add-article-to-specific-user-list', () => {
  const defaultPorts = {
    callAddArticleToList: () => TE.right(undefined),
    logger: dummyLogger,
  };

  describe('when a UserSavedArticle event is received', () => {
    describe('when the user is David Ashbrook', () => {
      let ports: Ports;

      const userId = toUserId('931653361');
      const articleId = arbitraryArticleId();

      const event = userSavedArticle(userId, articleId);

      describe('happy callAddArticleToList port', () => {
        beforeEach(async () => {
          ports = {
            ...defaultPorts,
            callAddArticleToList: jest.fn(defaultPorts.callAddArticleToList),
          };
          await addArticleToSpecificUserList(ports)(event)();
        });

        it('calls the AddArticleToList command', () => {
          expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.anything());
        });

        it('call the command with the article id coming from the event', () => {
          expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.objectContaining({ articleId }));
        });

        it('call the command with the list id for David Ashbrook', () => {
          expect(ports.callAddArticleToList).toHaveBeenCalledWith(
            expect.objectContaining({ listId: specificUserListId }),
          );
        });
      });

      describe('unhappy callAddArticleToList port', () => {
        beforeEach(async () => {
          ports = {
            callAddArticleToList: () => TE.left(arbitraryString()),
            logger: jest.fn(dummyLogger),
          };
          await addArticleToSpecificUserList(ports)(event)();
        });

        it.skip('logs an error level message', () => {
          expect(ports.logger).toHaveBeenCalledWith('error', expect.anything(), expect.anything());
        });
      });
    });

    describe('when the user is not David Ashbrook', () => {
      const ports = {
        ...defaultPorts,
        callAddArticleToList: jest.fn(defaultPorts.callAddArticleToList),
      };

      const userId = toUserId('not-david-ashbrook');

      const event = userSavedArticle(userId, arbitraryArticleId());

      beforeEach(async () => {
        await addArticleToSpecificUserList(ports)(event)();
      });

      it('does not call the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).not.toHaveBeenCalled();
      });
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
