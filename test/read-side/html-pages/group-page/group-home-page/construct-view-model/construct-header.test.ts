import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructHeader } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/construct-header';
import { ViewModel } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/view-model';
import * as LOID from '../../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../../framework';
import { shouldNotBeCalled } from '../../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../../write-side/commands/create-user-account-command.helper';

describe('construct-header', () => {
  let framework: TestFramework;
  let result: ViewModel['header'];

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has multiple lists', () => {
    beforeEach(async () => {
      const addGroupCommand = arbitraryAddGroupCommand();
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.createList({
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromGroupId(addGroupCommand.groupId),
      });
      await framework.commandHelpers.createList({
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromGroupId(addGroupCommand.groupId),
      });
      result = pipe(
        addGroupCommand.groupId,
        framework.queries.getGroup,
        O.getOrElseW(shouldNotBeCalled),
        constructHeader(framework.dependenciesForViews, O.none),
      );
    });

    it('displays a link to the group lists sub page', () => {
      expect(O.isSome(result.groupListsPageHref)).toBe(true);
    });
  });

  describe('when the group has only one list', () => {
    beforeEach(async () => {
      const addGroupCommand = arbitraryAddGroupCommand();
      await framework.commandHelpers.addGroup(addGroupCommand);
      result = pipe(
        addGroupCommand.groupId,
        framework.queries.getGroup,
        O.getOrElseW(shouldNotBeCalled),
        constructHeader(framework.dependenciesForViews, O.none),
      );
    });

    it('does not display a link to the group lists sub page', () => {
      expect(O.isNone(result.groupListsPageHref)).toBe(true);
    });
  });

  describe('when the user is an admin', () => {
    beforeEach(async () => {
      const addGroupCommand = arbitraryAddGroupCommand();
      const createUserCommand = arbitraryCreateUserAccountCommand();
      const assignUserAdminCommand = {
        groupId: addGroupCommand.groupId,
        userId: createUserCommand.userId,
      };

      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.createUserAccount(createUserCommand);
      await framework.commandHelpers.assignUserAsGroupAdmin(assignUserAdminCommand);
      result = pipe(
        addGroupCommand.groupId,
        framework.queries.getGroup,
        O.getOrElseW(shouldNotBeCalled),
        constructHeader(framework.dependenciesForViews, O.some(
          { handle: createUserCommand.handle, id: createUserCommand.userId },
        )),
      );
    });

    it('displays a link to the management page', () => {
      expect(O.isSome(result.managementPageHref)).toBe(true);
    });
  });

  describe('when the user is not an admin', () => {
    it.todo('does not display a link to the management page');
  });
});
