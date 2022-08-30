import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle } from '../../src/domain-events';
import { addArticleToSpecificUserList, Ports } from '../../src/policies/add-article-to-specific-user-list';
import { toUserId } from '../../src/types/user-id';
import { arbitraryArticleId } from '../types/article-id.helper';

describe('add-article-to-specific-user-list', () => {
  describe('when a UserSavedArticle event is received', () => {
    describe('when the user is David Ashbrook', () => {
      let ports: Ports;

      const userId = toUserId('931653361');
      const articleId = arbitraryArticleId();

      const event = userSavedArticle(userId, articleId);

      beforeEach(async () => {
        ports = {
          callAddArticleToList: jest.fn(() => TE.right(undefined)),
        };
        await addArticleToSpecificUserList(ports)(event)();
      });

      it('calls the AddArticleToList command', () => {
        expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.anything());
      });

      it('call the command with the article id coming from the event', () => {
        expect(ports.callAddArticleToList).toHaveBeenCalledWith(expect.objectContaining({ articleId }));
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
