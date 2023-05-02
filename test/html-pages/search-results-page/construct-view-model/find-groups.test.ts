import * as TE from 'fp-ts/TaskEither';
import { GroupId } from '../../../../src/types/group-id';
import { arbitraryString } from '../../../helpers';
import { arbitraryGroup } from '../../../types/group.helper';
import { Ports, findGroups } from '../../../../src/html-pages/search-results-page/construct-view-model/find-groups';
import { TestFramework, createTestFramework } from '../../../framework';

describe('find-groups', () => {
  let framework: TestFramework;
  let adapters: Ports;

  beforeEach(async () => {
    framework = createTestFramework();
    adapters = {
      fetchStaticFile: () => TE.right(''),
      ...framework.queries,
    };
  });

  describe('when there are matching groups', () => {
    const group1 = arbitraryGroup();
    const group2 = arbitraryGroup();

    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group1);
      await framework.commandHelpers.createGroup(group2);
      result = await findGroups(adapters, group1.name)();
    });

    it('returns an array containing the groupId', async () => {
      expect(result).toStrictEqual([group1.id]);
    });
  });

  describe('when there are no matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await findGroups(adapters, arbitraryString())();
    });

    it('returns an empty array', async () => {
      expect(result).toStrictEqual([]);
    });
  });
});
