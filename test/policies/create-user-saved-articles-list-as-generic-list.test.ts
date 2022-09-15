import * as TE from 'fp-ts/TaskEither';
import { userSavedArticle } from '../../src/domain-events';
import { createUserSavedArticlesListAsGenericList, Ports } from '../../src/policies/create-user-saved-articles-list-as-generic-list';
import * as LOID from '../../src/types/list-owner-id';
import { arbitraryWord } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('create-user-saved-articles-list-as-generic-list', () => {
  const defaultPorts = {
    createList: () => TE.right(undefined),
  };

  describe('when a UserSavedArticle event is received', () => {
    const userId = arbitraryUserId();
    const handle = arbitraryWord();
    const event = userSavedArticle(userId, arbitraryArticleId());
    let ports: Ports;

    describe('and that user owns no generic list', () => {
      describe('if the command succeeds', () => {
        beforeEach(async () => {
          ports = {
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
        it.todo('logs an error');
      });
    });

    describe('and the user already owns a generic list', () => {
      beforeEach(async () => {
        ports = {
          createList: jest.fn(defaultPorts.createList),
          getUserDetails: () => TE.right({ handle }),
          getListsOwnedBy: () => TE.right([{ id: arbitraryListId() }]),
        };
        await createUserSavedArticlesListAsGenericList(ports)(event)();
      });

      it('does not call the CreateList command', () => {
        expect(ports.createList).not.toHaveBeenCalled();
      });
    });
  });

  describe('when any other event is received', () => {
    it.todo('does not call the CreateList command');
  });
});
