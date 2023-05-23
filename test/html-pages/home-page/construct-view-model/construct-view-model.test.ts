import * as O from 'fp-ts/Option';
import { dummyLogger } from '../../../dummy-logger';
import { TestFramework, createTestFramework } from '../../../framework';
import { Ports, constructViewModel } from '../../../../src/html-pages/home-page/construct-view-model/construct-view-model';
import { arbitraryGroup } from '../../../types/group.helper';
import { ViewModel } from '../../../../src/html-pages/home-page/render-home-page';
import { arbitraryString } from '../../../helpers';

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

      beforeEach(async () => {
        await framework.commandHelpers.createGroup(group1);
        await framework.commandHelpers.createGroup(group2);
        viewModel = constructViewModel(adapters, [
          { groupId: group1.id, logoPath: arbitraryString() },
          { groupId: group2.id, logoPath: arbitraryString() },
        ]);
      });

      it.todo('returns the groups in the specified order');

      it.failing('returns the links to their group pages', () => {
        expect(viewModel.groups).toStrictEqual(O.some([
          expect.objectContaining({ link: `/groups/${group1.slug}` }),
          expect.objectContaining({ link: `/groups/${group2.slug}` }),
        ]));
      });

      it.todo('returns their names');

      it.todo('returns their provided logo paths');
    });

    describe('when any of the groups can not be found', () => {
      it.todo('does not include the groups component');
    });
  });
});
