import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { constructViewModel } from '../../../../src/html-pages/article-page/construct-view-model';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/types/list';
import { createTestFramework, TestFramework } from '../../../framework';
import { LoggedInUserListManagement } from '../../../../src/html-pages/article-page/view-model';
import { CreateListCommand, CreateUserAccountCommand } from '../../../../src/write-side/commands';
import { arbitraryCreateListCommand } from '../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const articleId = arbitraryArticleId();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the user is logged in', () => {
    let createUserAccountCommand: CreateUserAccountCommand;

    beforeEach(async () => {
      createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    });

    describe('when the article is not saved to the user\'s only list', () => {
      let list: List;
      let viewModel: LoggedInUserListManagement;

      beforeEach(async () => {
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to the default user list id', () => {
        expect(viewModel).toStrictEqual(E.left(expect.objectContaining({
          lists: [expect.objectContaining({ listId: list.id })],
        })));
      });

      it('list management has access to the default user list name', () => {
        expect(viewModel).toStrictEqual(E.left(expect.objectContaining({
          lists: [expect.objectContaining({ listName: list.name })],
        })));
      });
    });

    describe('when the article is not saved to any of the user\'s multiple lists', () => {
      let createListCommand: CreateListCommand;
      let viewModel: LoggedInUserListManagement;
      let usersLists: ReadonlyArray<List>;

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        usersLists = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId));
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the user\'s lists are ordered by descending of lastUpdated', () => {
        expect(viewModel).toStrictEqual(E.left({
          lists: [
            expect.objectContaining({ listId: usersLists[1].id }),
            expect.objectContaining({ listId: usersLists[0].id }),
          ],
        }));
      });

      it('list management has access to all of the user\'s multiple lists', () => {
        expect(viewModel).toStrictEqual(E.left({
          lists: [
            { listId: usersLists[1].id, listName: usersLists[1].name },
            { listId: usersLists[0].id, listName: usersLists[0].name },
          ],
        }));
      });
    });

    describe('when the article is saved to the default user list', () => {
      let list: List;
      let viewModel: LoggedInUserListManagement;

      beforeEach(async () => {
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        await framework.commandHelpers.addArticleToList(articleId, list.id);
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to list id', async () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          listId: list.id,
        })));
      });

      it('list management has access to list name', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          listName: list.name,
        })));
      });
    });

    describe('when the article is saved to another user list', () => {
      let createListCommand: CreateListCommand;
      let viewModel: LoggedInUserListManagement;

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
        viewModel = await pipe(
          {
            doi: articleId,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('list management has access to list id', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          listId: createListCommand.listId,
        })));
      });

      it('list management has access to list name', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          listName: createListCommand.name,
        })));
      });
    });
  });

  describe.skip('correct-language-semantics', () => {
    describe('the article title', () => {
      // eslint-disable-next-line jest/expect-expect
      it.each([
        ['en', 'Arbitrary title in English'],
        ['es', 'Título arbitrario en español'],
        ['pt', 'Título arbitrário em português'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ])('is correctly inferred as %s', async () => {
      });
    });

    describe('the article abstract', () => {
      // eslint-disable-next-line jest/expect-expect
      it.each([
        ['en', 'This text represents the abstract of this article in English.'],
        ['es', 'Este texto representa el resumen de este artículo en español.'],
        ['pt', 'Este texto representa o resumo deste artigo em português.'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ])('is correctly inferred as %s', async () => {
      });
    });
  });
});
