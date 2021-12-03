import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupCreated } from '../../src/domain-events';
import { findGroups } from '../../src/search-results-page/find-groups';
import { GroupId } from '../../src/types/group-id';
import { arbitraryString } from '../helpers';
import { arbitraryGroup } from '../types/group.helper';

describe('find-groups', () => {
  const group1 = arbitraryGroup();
  const group2 = arbitraryGroup();
  const ports = {
    fetchStaticFile: () => TE.right(''),
  };

  describe('when there are matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await pipe(
        [
          groupCreated(group1),
          groupCreated(group2),
        ],
        findGroups(ports, group1.name),
      )();
    });

    it('returns an array containing the groupId', async () => {
      expect(result).toStrictEqual([group1.id]);
    });
  });

  describe('when there are no matching groups', () => {
    let result: ReadonlyArray<GroupId>;

    beforeEach(async () => {
      result = await pipe(
        [groupCreated(group1)],
        findGroups(ports, arbitraryString()),
      )();
    });

    it('returns an empty array', async () => {
      expect(result).toStrictEqual([]);
    });
  });
});
