import * as O from 'fp-ts/Option';
import { TestFramework, createTestFramework } from '../../../framework/index.js';
import { constructViewModel } from '../../../../src/html-pages/home-page/construct-view-model/construct-view-model.js';
import { ViewModel } from '../../../../src/html-pages/home-page/view-model.js';
import { arbitraryString } from '../../../helpers.js';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper.js';
import { arbitraryGroupId } from '../../../types/group-id.helper.js';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('groups', () => {
    let viewModel: ViewModel;

    describe('when all groups can be found', () => {
      const addGroup1 = arbitraryAddGroupCommand();
      const addGroup2 = arbitraryAddGroupCommand();
      const group1LogoPath = arbitraryString();
      const group2LogoPath = arbitraryString();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1);
        await framework.commandHelpers.updateGroupDetails(addGroup1.groupId, group1LogoPath);
        await framework.commandHelpers.addGroup(addGroup2);
        await framework.commandHelpers.updateGroupDetails(addGroup2.groupId, group2LogoPath);
        viewModel = constructViewModel(framework.dependenciesForViews, [
          { groupId: addGroup1.groupId },
          { groupId: addGroup2.groupId },
        ]);
      });

      it('returns the groups in the specified order', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ groupName: addGroup1.name }),
          expect.objectContaining({ groupName: addGroup2.name }),
        ]));
      });
    });

    describe('when any of the groups can not be found', () => {
      const addExistingGroup = arbitraryAddGroupCommand();
      const addNotSelectedGroup = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addExistingGroup);
        await framework.commandHelpers.updateGroupDetails(addExistingGroup.groupId, arbitraryString());
        await framework.commandHelpers.addGroup(addNotSelectedGroup);
        await framework.commandHelpers.updateGroupDetails(addNotSelectedGroup.groupId, arbitraryString());
        viewModel = constructViewModel(framework.dependenciesForViews, [
          { groupId: addExistingGroup.groupId },
          { groupId: arbitraryGroupId() },
        ]);
      });

      it('does not include the groups component', () => {
        expect(viewModel.groups).toStrictEqual(O.none);
      });
    });
  });
});
