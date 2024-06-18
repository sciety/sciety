import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/non-html-views/api/groups/construct-view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
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

  describe.skip('when the group has no admins', () => {
    let admins: ReadonlyArray<unknown>;

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const viewModel = pipe(
        framework.dependenciesForViews,
        constructViewModel,
      );
    });

    it('lists no admins', () => {
      expect(admins).toHaveLength(0);
    });
  });
});
