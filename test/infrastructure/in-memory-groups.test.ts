import * as O from 'fp-ts/Option';
import { inMemoryGroupRepository } from '../../src/infrastructure/in-memory-groups';
import { GroupId } from '../../src/types/group-id';
import { GroupRepository } from '../../src/types/group-repository';

const groupId = new GroupId('530812a5-838a-4fb2-95b6-eb4828f0d37c');

describe('in-memory-editorial-communities', () => {
  let repository: GroupRepository;
  const group = {
    id: groupId,
    name: 'My pals',
    avatarPath: '',
    shortDescription: '',
    descriptionPath: '/static/desc.md',
  };

  beforeEach(async () => {
    repository = inMemoryGroupRepository([group]);
  });

  describe('lookup', () => {
    it('returns nothing when the editorial group does not exist', async () => {
      expect((await repository.lookup(new GroupId('no-such-thing'))())).toStrictEqual(O.none);
    });

    it('returns the editorial group when it does exist', async () => {
      const actual = await repository.lookup(new GroupId(groupId.value))();

      expect(actual).toStrictEqual(O.some(group));
    });
  });
});
