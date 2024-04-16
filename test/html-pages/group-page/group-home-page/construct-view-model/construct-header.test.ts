import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructHeader } from '../../../../../src/html-pages/group-page/group-home-page/construct-view-model/construct-header';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-home-page/view-model';
import * as LOID from '../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';

describe('construct-header', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has multiple lists', () => {
    let result: ViewModel['header'];

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
    let result: ViewModel['header'];

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
});
