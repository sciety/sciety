import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CandidateUserHandle } from '../../../../../src/types/candidate-user-handle.js';
import { shouldNotBeCalled } from '../../../../should-not-be-called.js';
import { TestFramework, createTestFramework } from '../../../../framework/index.js';
import { constructViewModel } from '../../../../../src/html-pages/user-page/user-following-page/construct-view-model/index.js';
import { ViewModel } from '../../../../../src/html-pages/user-page/user-following-page/view-model.js';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper.js';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper.js';

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
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, addGroup1.groupId);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, addGroup2.groupId);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, addGroup3.groupId);
    });

    describe('when the followed groups tab is selected', () => {
      beforeEach(async () => {
        viewmodel = await pipe(
          pageParams,
          constructViewModel(framework.queries),
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

      it.failing('returns them in order of most recently followed first', async () => {
        expect(viewmodel).toStrictEqual(expect.objectContaining({
          followedGroups: O.some([
            expect.objectContaining({ id: addGroup3.groupId }),
            expect.objectContaining({ id: addGroup2.groupId }),
            expect.objectContaining({ id: addGroup1.groupId }),
          ]),
        }));
      });
    });
  });

  describe('user details', () => {
    beforeEach(async () => {
      viewmodel = await pipe(
        pageParams,
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('exposes the user details', async () => {
      expect(viewmodel.userDetails.handle).toBe(createUserAccountCommand.handle);
      expect(viewmodel.userDetails.displayName).toBe(createUserAccountCommand.displayName);
      expect(viewmodel.userDetails.avatarUrl).toBe(createUserAccountCommand.avatarUrl);
    });
  });
});
