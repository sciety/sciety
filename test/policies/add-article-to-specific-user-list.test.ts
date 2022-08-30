import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle } from '../../src/domain-events';
import { addArticleToSpecificUserList } from '../../src/policies/add-article-to-specific-user-list';
import { toUserId } from '../../src/types/user-id';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('add-article-to-specific-user-list', () => {
  describe('when a UserSavedArticle event is received', () => {
    describe('when the user is David Ashbrook', () => {
      const ports = {
        callAddArticleToList: jest.fn(() => TE.right(undefined)),
      };

      const userId = toUserId('931653361');

      const event = userSavedArticle(userId, arbitraryArticleId());

      beforeEach(async () => {
        await addArticleToSpecificUserList(ports)(event)();
      });

      it.skip('calls the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.anything());
      });
    });

    describe('when the user is not David Ashbrook', () => {
      it.todo('does not call the AddArticleToList command');
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
