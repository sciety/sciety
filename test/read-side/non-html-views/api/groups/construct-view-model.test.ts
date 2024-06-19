import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/non-html-views/api/groups/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/non-html-views/api/groups/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  let framework: TestFramework;
  let groupStatus: ViewModel[number];

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
  });

  describe('when the group has admins', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      await framework.commandHelpers.assignUserAsGroupAdmin({
        userId: createUserAccountCommand.userId,
        groupId: addGroupCommand.groupId,
      });
      groupStatus = pipe(
        framework.dependenciesForViews,
        constructViewModel,
        RA.findFirst((status) => status.id === addGroupCommand.groupId),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it.failing('lists all of the admins', () => {
      expect(groupStatus.admins).toStrictEqual([O.some(createUserAccountCommand.handle)]);
    });
  });

  describe('when the group has no admins', () => {
    beforeEach(async () => {
      groupStatus = pipe(
        framework.dependenciesForViews,
        constructViewModel,
        RA.findFirst((status) => status.id === addGroupCommand.groupId),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('lists no admins', () => {
      expect(groupStatus.admins).toHaveLength(0);
    });
  });
});
