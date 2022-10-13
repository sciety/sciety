import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent, userSavedArticle } from '../../src/domain-events';
import { AddArticleToList } from '../../src/shared-ports';
import { dummyLogger } from '../dummy-logger';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

type Ports = {
  addArticleToList: AddArticleToList,
};

type AddArticleToGenericListFromUserSavedArticle = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

const addArticleToGenericListFromUserSavedArticle: AddArticleToGenericListFromUserSavedArticle = (
) => () => T.of(undefined);

describe('add-article-to-generic-list-from-user-saved-article', () => {
  const defaultPorts = {
    addArticleToList: () => TE.right(undefined),
    logger: dummyLogger,
  };

  let ports: Ports;

  describe('when a UserSavedArticle event is received', () => {
    describe('and the user has a generic list', () => {
      const userId = arbitraryUserId();
      const articleId = arbitraryArticleId();

      const event = userSavedArticle(userId, articleId);

      beforeEach(async () => {
        ports = {
          addArticleToList: jest.fn(defaultPorts.addArticleToList),
        };
        await addArticleToGenericListFromUserSavedArticle(ports)(event)();
      });

      it.failing('calls the AddArticleToList command', () => {
        expect(ports.addArticleToList).toHaveBeenCalledWith(expect.anything());
      });

      it.todo('calls the command with the generic list id owned by that user');

      it.todo('calls the command with the article id in the UserSavedArticle event');
    });

    describe('and the user does not have a generic list', () => {
      it.todo('logs an error');
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
