import { constructViewModel } from '../../../../../src/read-side/non-html-views/api/groups/construct-view-model';
import { createTestFramework, TestFramework } from '../../../../framework';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has admins', () => {
    it.todo('lists all of the admins');
  });

  describe.skip('when the group has no admins', () => {
    let admins: ReadonlyArray<unknown>;

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const viewModel = constructViewModel(framework.dependenciesForViews);
    });

    it('lists no admins', () => {
      expect(admins).toHaveLength(0);
    });
  });
});
