import * as TE from 'fp-ts/TaskEither';
import { findGroups } from '../../src/infrastructure/find-groups';
import { GroupId } from '../../src/types/group-id';
import { arbitraryGroupId, groupIdFromString } from '../types/group-id.helper';

type Group = {
  id: GroupId,
  avatarPath?: string,
  descriptionPath?: string,
  name?: string,
  shortDescription?: string,
  homepage?: string,
};

const constructGroup = ({
  id,
  avatarPath = '',
  descriptionPath = '',
  name = '',
  shortDescription = '',
  homepage = '',
}: Group) => ({
  id,
  avatarPath,
  descriptionPath,
  name,
  shortDescription,
  homepage,
});

describe('find-groups', () => {
  describe('provided a valid group name', () => {
    it('returns an array containing the groupId', async () => {
      const result = await findGroups(() => TE.right(''), [constructGroup({ id: groupIdFromString('12345'), name: 'My Group' })])('My Group')();

      expect(result).toStrictEqual([groupIdFromString('12345')]);
    });
  });

  describe('provided an invalid group name', () => {
    it('returns an empty array', async () => {
      const result = await findGroups(() => TE.right(''), [constructGroup({ id: arbitraryGroupId(), name: 'My Group' })])('Other Group')();

      expect(result).toStrictEqual([]);
    });
  });
});
