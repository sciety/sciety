import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { List } from '../../../../../src/read-models/lists';
import { constructViewModel } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model';
import { LoggedInUserListManagement, ViewModel } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { ArticleId } from '../../../../../src/types/article-id';
import * as DE from '../../../../../src/types/data-error';
import * as LOID from '../../../../../src/types/list-owner-id';
import { CreateListCommand, CreateUserAccountCommand } from '../../../../../src/write-side/commands';
import { abortTest } from '../../../../abort-test';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

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
      let saveArticleCta: (LoggedInUserListManagement & { '_tag': 'Left' })['left'];

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        saveArticleCta = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(abortTest('constructViewModel unexpectedly is on the left')),
          TE.match(identity, abortTest('LoggedInUserListManagement is unexpectedly on the right')),
        )();
      });

      it('displays save this article call to action', () => {
        expect(saveArticleCta.saveArticleHref).toStrictEqual(expect.anything());
      });
    });

    describe('when the article is saved to the default user list', () => {
      let list: List;
      let containingList: (LoggedInUserListManagement & { '_tag': 'Right' })['right'];

      beforeEach(async () => {
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        await framework.commandHelpers.addArticleToList({ articleId: new ArticleId(expressionDoi), listId: list.id });
        containingList = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
          TE.getOrElse(abortTest('LoggedInUserListManagement is unexpectedly on the left')),
        )();
      });

      it('list management has access to list id', async () => {
        expect(containingList.listId).toStrictEqual(list.id);
      });

      it('list management has access to list name', () => {
        expect(containingList.listName).toStrictEqual(list.name);
      });
    });

    describe('when the article is saved to another user list', () => {
      let createListCommand: CreateListCommand;
      let containingList: (LoggedInUserListManagement & { '_tag': 'Right' })['right'];

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList(
          { articleId: new ArticleId(expressionDoi), listId: createListCommand.listId },
        );
        containingList = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
          TE.getOrElse(abortTest('LoggedInUserListManagement is unexpectedly on the left')),
        )();
      });

      it('list management has access to list id', () => {
        expect(containingList.listId).toStrictEqual(createListCommand.listId);
      });

      it('list management has access to list name', () => {
        expect(containingList.listName).toStrictEqual(createListCommand.name);
      });
    });
  });
});
