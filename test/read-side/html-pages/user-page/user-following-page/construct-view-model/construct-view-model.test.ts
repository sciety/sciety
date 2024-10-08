import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../../src/read-side/html-pages/user-page/user-following-page/construct-view-model';
import { ViewModel } from '../../../../../../src/read-side/html-pages/user-page/user-following-page/view-model';
import { CandidateUserHandle } from '../../../../../../src/types/candidate-user-handle';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';
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

  describe('when the user follows three groups', () => {
    const addGroup1 = arbitraryAddGroupCommand();
    const addGroup2 = arbitraryAddGroupCommand();
    const addGroup3 = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1);
      await framework.commandHelpers.addGroup(addGroup2);
      await framework.commandHelpers.addGroup(addGroup3);
      await framework.commandHelpers.followGroup(
        { userId: createUserAccountCommand.userId, groupId: addGroup1.groupId },
      );
      await framework.commandHelpers.followGroup(
        { userId: createUserAccountCommand.userId, groupId: addGroup2.groupId },
      );
      await framework.commandHelpers.followGroup(
        { userId: createUserAccountCommand.userId, groupId: addGroup3.groupId },
      );
    });

    describe('when the followed groups tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the following count is 3', () => {
        // eslint-disable-next-line jest/prefer-to-have-length
        expect(viewmodel.groupIds.length).toBe(3);
      });

      it('three group cards are displayed', () => {
        if (O.isNone(viewmodel.followedGroups)) {
          throw new Error('None received, should have been Some');
        }

        expect(viewmodel.followedGroups.value).toHaveLength(3);
      });
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
