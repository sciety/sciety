import * as O from 'fp-ts/Option';
import { dummyLogger } from '../../../dummy-logger';
import { TestFramework, createTestFramework } from '../../../framework';
import { Ports, constructViewModel } from '../../../../src/html-pages/home-page/construct-view-model/construct-view-model';
import { arbitraryGroup } from '../../../types/group.helper';
import { ViewModel } from '../../../../src/html-pages/home-page/render-home-page';
import { arbitraryString } from '../../../helpers';
import { arbitraryGroupId } from '../../../types/group-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
      logger: dummyLogger,
    };
  });

  describe('groups', () => {
    let viewModel: ViewModel;

    describe('when all groups can be found', () => {
      const group1 = arbitraryGroup();
      const group2 = arbitraryGroup();
      const group1LogoPath = arbitraryString();
      const group2LogoPath = arbitraryString();

      beforeEach(async () => {
        await framework.commandHelpers.createGroup(group1);
        await framework.commandHelpers.createGroup(group2);
        viewModel = constructViewModel(adapters, [
          { groupId: group1.id, logoPath: group1LogoPath },
          { groupId: group2.id, logoPath: group2LogoPath },
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
      const existingGroupLogoPath = arbitraryString();
      const notSelectedGroup = arbitraryGroup();
      const notExistingGroupId = arbitraryGroupId();

      beforeEach(async () => {
        await framework.commandHelpers.createGroup(existingGroup);
        await framework.commandHelpers.createGroup(notSelectedGroup);
        viewModel = constructViewModel(adapters, [
          { groupId: existingGroup.id, logoPath: existingGroupLogoPath },
          { groupId: notExistingGroupId, logoPath: arbitraryString() },
        ]);
      });

      it('does not include the groups component', () => {
        expect(viewModel.groups).toStrictEqual(O.none);
      });
    });
  });
});
