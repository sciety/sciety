import * as O from 'fp-ts/Option';
import { inMemoryGroupRepository } from '../../src/infrastructure/in-memory-groups';
import { Group } from '../../src/types/group';
import { GroupId } from '../../src/types/group-id';
import { GroupRepository } from '../../src/types/group-repository';

const editorialCommunityId = new GroupId('530812a5-838a-4fb2-95b6-eb4828f0d37c');

describe('in-memory-editorial-communities', () => {
  let repository: GroupRepository;
  const community: Group = {
    id: editorialCommunityId,
    name: 'My pals',
    avatarPath: '',
    shortDescription: '',
    descriptionPath: '/static/desc.md',
  };

  beforeEach(async () => {
    repository = inMemoryGroupRepository([community]);
  });

  describe('lookup', () => {
    it('returns nothing when the editorial community does not exist', async () => {
      expect((await repository.lookup(new GroupId('no-such-thing'))())).toStrictEqual(O.none);
    });

    it('returns the editorial community when it does exist', async () => {
      const actual = await repository.lookup(new GroupId(editorialCommunityId.value))();

      expect(actual).toStrictEqual(O.some(community));
    });
  });
});
