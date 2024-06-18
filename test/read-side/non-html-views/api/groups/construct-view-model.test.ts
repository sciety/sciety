import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/non-html-views/api/groups/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/non-html-views/api/groups/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';

describe('construct-view-model', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  let framework: TestFramework;

  beforeEach(async () => {
    framework = createTestFramework();
    await framework.commandHelpers.addGroup(addGroupCommand);
  });

  describe('when the group has admins', () => {
    it.todo('lists all of the admins');
  });

  describe('when the group has no admins', () => {
    let groupStatus: ViewModel[number];

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
