import * as TE from 'fp-ts/TaskEither';
import { findGroups } from '../../../../src/html-pages/search-results-page/construct-view-model/find-groups';
import { GroupId } from '../../../../src/types/group-id';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryString } from '../../../helpers';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';

describe('find-groups', () => {
  let framework: TestFramework;
  let dependencies: TestFramework['dependenciesForViews'];

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.dependenciesForViews,
      fetchStaticFile: () => TE.right(''),
    };
  });

  describe('when there are matching groups', () => {
    const addGroup1 = arbitraryAddGroupCommand();
    const addGroup2 = arbitraryAddGroupCommand();

    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1);
      await framework.commandHelpers.addGroup(addGroup2);
      result = await findGroups(dependencies, addGroup1.name)();
    });

    it('returns an array containing the groupId', async () => {
      expect(result).toStrictEqual([addGroup1.groupId]);
    });
  });

  describe('when there are no matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await findGroups(dependencies, arbitraryString())();
    });

    it('returns an empty array', async () => {
      expect(result).toStrictEqual([]);
    });
  });
});
