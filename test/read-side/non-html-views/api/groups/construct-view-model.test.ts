import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/non-html-views/api/groups/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/non-html-views/api/groups/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryAssignUserAsGroupAdmin } from '../../../../write-side/commands/assign-user-as-group-admin-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  let framework: TestFramework;
  const getViewModel = () => pipe(
    framework.dependenciesForViews,
    constructViewModel,
    RA.findFirst((status) => status.id === addGroupCommand.groupId),
    O.getOrElseW(shouldNotBeCalled),
  );
  let groupStatus: ViewModel[number];

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
  });

  describe('when the group has admins that have user accounts', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      await framework.commandHelpers.assignUserAsGroupAdmin({
        ...arbitraryAssignUserAsGroupAdmin(),
        userId: createUserAccountCommand.userId,
        groupId: addGroupCommand.groupId,
      });
      groupStatus = getViewModel();
    });

    it('lists all of the admins', () => {
      expect(groupStatus.admins).toStrictEqual([O.some({ userHandle: createUserAccountCommand.handle })]);
    });
  });

  describe('when the group has admins that do not have user accounts', () => {
    beforeEach(async () => {
      await framework.commandHelpers.assignUserAsGroupAdmin({
        ...arbitraryAssignUserAsGroupAdmin(),
        groupId: addGroupCommand.groupId,
      });
      groupStatus = getViewModel();
    });

    it('lists all of the admins', () => {
      expect(groupStatus.admins).toStrictEqual([O.none]);
    });
  });

  describe('when the group has no admins', () => {
    beforeEach(async () => {
      groupStatus = getViewModel();
    });

    it('lists no admins', () => {
      expect(groupStatus.admins).toHaveLength(0);
    });
  });
});
