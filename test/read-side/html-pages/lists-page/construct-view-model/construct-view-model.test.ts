import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../../src/read-models/lists';
import { constructViewModel } from '../../../../../src/read-side/html-pages/lists-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/html-pages/lists-page/view-model';
import * as LOID from '../../../../../src/types/list-owner-id';
import { abortTest } from '../../../../abort-test';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are two populated user lists', () => {
    let initialUserList: List;
    const command = {
      ...arbitraryCreateListCommand(),
      ownerId: LOID.fromUserId(createUserAccountCommand.userId),
    };
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      await framework.commandHelpers.addArticleToList({
        expressionDoi: arbitraryExpressionDoi(),
        listId: initialUserList.id,
      });
      await framework.commandHelpers.createList(command);
      await framework.commandHelpers.addArticleToList({
        expressionDoi: arbitraryExpressionDoi(),
        listId: command.listId,
      });
      viewmodel = await pipe(
        { page: 1 },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(abortTest('viewmodel construction returned on the left')),
      )();
    });

    it('returns two cards', () => {
      expect(viewmodel.listCards).toHaveLength(2);
    });

    it('the most recently updated list is shown first', async () => {
      expect(viewmodel.listCards[0].listId).toStrictEqual(command.listId);
      expect(viewmodel.listCards[1].listId).toStrictEqual(initialUserList.id);
    });
  });

  describe('when there is a populated user list', () => {
    describe('when the user information cannot be retrieved', () => {
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      let viewmodel: ViewModel;

      beforeEach(async () => {
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList(
          { expressionDoi: arbitraryExpressionDoi(), listId: createListCommand.listId },
        );

        viewmodel = await pipe(
          { page: 1 },
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(abortTest('viewmodel construction returned on the left')),
        )();
      });

      it('still returns a list card', () => {
        expect(viewmodel.listCards).toHaveLength(1);
      });
    });
  });
});
