import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { constructViewModel } from '../../../../src/html-pages/paper-activity-page/construct-view-model';
import * as DE from '../../../../src/types/data-error';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/read-models/lists';
import { createTestFramework, TestFramework } from '../../../framework';
import { LoggedInUserListManagement, ViewModel } from '../../../../src/html-pages/paper-activity-page/view-model';
import { CreateListCommand, CreateUserAccountCommand } from '../../../../src/write-side/commands';
import { arbitraryCreateListCommand } from '../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { ArticleId } from '../../../../src/types/article-id';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const expressionDoi = arbitraryExpressionDoi();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when no paper expressions can be found', () => {
    let viewModel: E.Either<unknown, ViewModel>;

    beforeEach(async () => {
      viewModel = await pipe(
        {
          latestExpressionDoi: arbitraryExpressionDoi(),
          user: O.none,
        },
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchPublishingHistory: () => TE.left(DE.notFound),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });

  describe('when the user is logged in', () => {
    let createUserAccountCommand: CreateUserAccountCommand;

    beforeEach(async () => {
      createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    });

    describe('when the article is not saved to any of the user\'s multiple lists', () => {
      let createListCommand: CreateListCommand;
      let viewModel: LoggedInUserListManagement;

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        viewModel = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('displays save this article call to action', () => {
        expect(viewModel).toStrictEqual(E.left(expect.objectContaining({
          saveArticleHref: expect.anything(),
        })));
      });
    });

    describe('when the article is saved to the default user list', () => {
      let list: List;
      let viewModel: LoggedInUserListManagement;

      beforeEach(async () => {
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        await framework.commandHelpers.addArticleToList(new ArticleId(expressionDoi), list.id);
        viewModel = await pipe(
          {
            latestExpressionDoi: expressionDoi,
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
        await framework.commandHelpers.addArticleToList(new ArticleId(expressionDoi), createListCommand.listId);
        viewModel = await pipe(
          {
            latestExpressionDoi: expressionDoi,
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
});
