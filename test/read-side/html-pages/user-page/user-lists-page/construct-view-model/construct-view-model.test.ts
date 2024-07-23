import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../../../src/read-models/lists';
import { constructViewModel } from '../../../../../../src/read-side/html-pages/user-page/user-lists-page/construct-view-model';
import { ViewModel } from '../../../../../../src/read-side/html-pages/user-page/user-lists-page/view-model';
import { CandidateUserHandle } from '../../../../../../src/types/candidate-user-handle';
import * as LOID from '../../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../../types/expression-doi.helper';
import { arbitraryCreateListCommand } from '../../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let viewmodel: ViewModel;
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();
  const pageParams = {
    handle: createUserAccountCommand.handle as string as CandidateUserHandle,
    user: O.none,
  };

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.createUserAccount(createUserAccountCommand);
  });

  describe('when the user owns two lists', () => {
    let initialUserList: List;
    const command = {
      ...arbitraryCreateListCommand(),
      ownerId: LOID.fromUserId(createUserAccountCommand.userId),
    };

    beforeEach(async () => {
      initialUserList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      await framework.commandHelpers.createList(command);
      await framework.commandHelpers.addArticleToList({
        expressionDoi: arbitraryExpressionDoi(),
        listId: command.listId,
      });
    });

    describe('and the lists tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the list count is 2', async () => {
        expect(viewmodel.listCount).toBe(2);
      });

      it('two list cards are displayed', () => {
        expect(viewmodel.ownedLists).toHaveLength(2);
      });

      it('the most recently updated list is shown first', async () => {
        expect(viewmodel.ownedLists[0].listId).toStrictEqual(command.listId);
        expect(viewmodel.ownedLists[1].listId).toStrictEqual(initialUserList.id);
      });
    });
  });

  describe('when the user saves an article to the default list for the first time', () => {
    beforeEach(async () => {
      const listId = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0].id;
      await framework.commandHelpers.addArticleToList({ expressionDoi: arbitraryExpressionDoi(), listId });
      viewmodel = await pipe(
        pageParams,
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the article count of the default list is 1', async () => {
      expect(viewmodel.ownedLists[0].articleCount).toBe(1);
    });
  });

  describe('user details', () => {
    beforeEach(async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('exposes the user details', async () => {
      expect(viewmodel.userDetails.handle).toBe(createUserAccountCommand.handle);
      expect(viewmodel.userDetails.displayName).toBe(createUserAccountCommand.displayName);
    });
  });
});
