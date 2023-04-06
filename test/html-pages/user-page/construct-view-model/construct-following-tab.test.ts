import * as O from 'fp-ts/Option';
import { arbitraryGroup } from '../../../types/group.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { constructFollowingTab } from '../../../../src/html-pages/user-page/construct-view-model/construct-following-tab';

describe('construct-following-tab', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the user follows three groups', () => {
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();
    const group3 = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group1);
      await framework.commandHelpers.createGroup(group2);
      await framework.commandHelpers.createGroup(group3);
    });

    it.failing('returns them in order of most recently followed first', async () => {
      const ports = {
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
      };
      const viewmodel = await constructFollowingTab(ports, [group1.id, group2.id, group3.id])();

      expect(viewmodel.followedGroups).toStrictEqual(O.some([
        expect.objectContaining({ id: group3.id }),
        expect.objectContaining({ id: group2.id }),
        expect.objectContaining({ id: group1.id }),
      ]));
    });
  });
});
