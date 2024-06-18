import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../../src/read-side/html-pages/home-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../../src/read-side/html-pages/home-page/view-model';
import { GroupLinkWithLogoViewModel } from '../../../../../src/read-side/html-pages/shared-components/group-link';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitraryString } from '../../../../helpers';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryGroupId } from '../../../../types/group-id.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';

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
        await framework.commandHelpers.updateGroupDetails(
          { groupId: addGroup1.groupId, largeLogoPath: group1LogoPath },
        );
        await framework.commandHelpers.addGroup(addGroup2);
        await framework.commandHelpers.updateGroupDetails(
          { groupId: addGroup2.groupId, largeLogoPath: group2LogoPath },
        );
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
        await framework.commandHelpers.updateGroupDetails(
          { groupId: addExistingGroup.groupId, largeLogoPath: arbitraryString() },
        );
        await framework.commandHelpers.addGroup(addNotSelectedGroup);
        await framework.commandHelpers.updateGroupDetails(
          { groupId: addNotSelectedGroup.groupId, largeLogoPath: arbitraryString() },
        );
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
