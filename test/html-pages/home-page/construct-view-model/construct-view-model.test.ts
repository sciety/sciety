import * as O from 'fp-ts/Option';
import { TestFramework, createTestFramework } from '../../../framework';
import { constructViewModel } from '../../../../src/html-pages/home-page/construct-view-model/construct-view-model';
import { arbitraryGroup } from '../../../types/group.helper';
import { ViewModel } from '../../../../src/html-pages/home-page/view-model';
import { arbitraryString } from '../../../helpers';
import { arbitraryGroupId } from '../../../types/group-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('groups', () => {
    let viewModel: ViewModel;

    describe('when all groups can be found', () => {
      const group1 = arbitraryGroup();
      const group2 = arbitraryGroup();
      const group1LogoPath = arbitraryString();
      const group2LogoPath = arbitraryString();

      beforeEach(async () => {
        await framework.commandHelpers.deprecatedCreateGroup(group1);
        await framework.commandHelpers.updateGroupDetails(group1.id, group1LogoPath);
        await framework.commandHelpers.deprecatedCreateGroup(group2);
        await framework.commandHelpers.updateGroupDetails(group2.id, group2LogoPath);
        viewModel = constructViewModel(framework.dependenciesForViews, [
          { groupId: group1.id },
          { groupId: group2.id },
        ]);
      });

      it('returns the groups in the specified order', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ name: group1.name }),
          expect.objectContaining({ name: group2.name }),
        ]));
      });

      it('returns the links to their group pages', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ link: `/groups/${group1.slug}` }),
          expect.objectContaining({ link: `/groups/${group2.slug}` }),
        ]));
      });

      it('returns their names', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ name: group1.name }),
          expect.objectContaining({ name: group2.name }),
        ]));
      });

      it('returns their provided logo paths', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ logoPath: group1LogoPath }),
          expect.objectContaining({ logoPath: group2LogoPath }),
        ]));
      });
    });

    describe('when any of the groups can not be found', () => {
      const existingGroup = arbitraryGroup();
      const notSelectedGroup = arbitraryGroup();
      const notExistingGroupId = arbitraryGroupId();

      beforeEach(async () => {
        await framework.commandHelpers.deprecatedCreateGroup(existingGroup);
        await framework.commandHelpers.updateGroupDetails(existingGroup.id, arbitraryString());
        await framework.commandHelpers.deprecatedCreateGroup(notSelectedGroup);
        await framework.commandHelpers.updateGroupDetails(notSelectedGroup.id, arbitraryString());
        viewModel = constructViewModel(framework.dependenciesForViews, [
          { groupId: existingGroup.id },
          { groupId: notExistingGroupId },
        ]);
      });

      it('does not include the groups component', () => {
        expect(viewModel.groups).toStrictEqual(O.none);
      });
    });
  });
});
