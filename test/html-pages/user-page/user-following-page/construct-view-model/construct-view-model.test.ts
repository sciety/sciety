import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CandidateUserHandle } from '../../../../../src/types/candidate-user-handle';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { TestFramework, createTestFramework } from '../../../../framework';
import { constructViewModel } from '../../../../../src/html-pages/user-page/user-following-page/construct-view-model';
import { ViewModel } from '../../../../../src/html-pages/user-page/user-following-page/view-model';
import { arbitraryGroup } from '../../../../types/group.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

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
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();
    const group3 = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group1);
      await framework.commandHelpers.deprecatedCreateGroup(group2);
      await framework.commandHelpers.deprecatedCreateGroup(group3);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group1.id);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group2.id);
      await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group3.id);
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
            expect.objectContaining({ id: group3.id }),
            expect.objectContaining({ id: group2.id }),
            expect.objectContaining({ id: group1.id }),
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
