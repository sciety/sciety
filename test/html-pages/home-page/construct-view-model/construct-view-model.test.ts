import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { TestFramework, createTestFramework } from '../../../framework';
import { constructViewModel } from '../../../../src/html-pages/home-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/home-page/view-model';
import { arbitraryString } from '../../../helpers';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { GroupLinkWithLogoViewModel } from '../../../../src/html-pages/shared-components/group-link';
import { shouldNotBeCalled } from '../../../should-not-be-called';

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
      let groups: ReadonlyArray<GroupLinkWithLogoViewModel>;

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroup1);
        await framework.commandHelpers.updateGroupDetails(addGroup1.groupId, group1LogoPath);
        await framework.commandHelpers.addGroup(addGroup2);
        await framework.commandHelpers.updateGroupDetails(addGroup2.groupId, group2LogoPath);
        groups = pipe(
          constructViewModel(framework.dependenciesForViews, [
            { groupId: addGroup1.groupId },
            { groupId: addGroup2.groupId },
          ]).groups,
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('returns the groups in the specified order', () => {
        expect(groups[0].groupName).toStrictEqual(addGroup1.name);
        expect(groups[1].groupName).toStrictEqual(addGroup2.name);
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
