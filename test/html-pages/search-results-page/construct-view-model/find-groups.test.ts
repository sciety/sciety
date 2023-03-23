import * as TE from 'fp-ts/TaskEither';
import { GroupId } from '../../../../src/types/group-id';
import { arbitraryString } from '../../../helpers';
import { arbitraryGroup } from '../../../types/group.helper';
import { findGroups } from '../../../../src/html-pages/search-results-page/construct-view-model/find-groups';

describe('find-groups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const ports = {
    fetchStaticFile: () => TE.right(''),
    getAllGroups: () => [group1, group2],
  };

  describe('when there are matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await findGroups(ports, group1.name)();
    });

    it('returns an array containing the groupId', async () => {
      expect(result).toStrictEqual([group1.id]);
    });
  });

  describe('when there are no matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await findGroups(ports, arbitraryString())();
    });

    it('returns an empty array', async () => {
      expect(result).toStrictEqual([]);
    });
  });
});
