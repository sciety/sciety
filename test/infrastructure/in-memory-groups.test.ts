import * as O from 'fp-ts/Option';
import { inMemoryGroupRepository } from '../../src/infrastructure/in-memory-groups';
import { GroupRepository } from '../../src/types/group-repository';
import { arbitraryUri, arbitraryWord } from '../helpers';
import { arbitraryGroupId, groupIdFromString } from '../types/group-id.helper';

const id = '530812a5-838a-4fb2-95b6-eb4828f0d37c';
const groupId = groupIdFromString(id);
const groupSlug = arbitraryWord();

describe('in-memory-editorial-communities', () => {
  let repository: GroupRepository;
  const group = {
    id: groupId,
    name: 'My pals',
    avatarPath: '',
    shortDescription: '',
    descriptionPath: '/static/desc.md',
    homepage: arbitraryUri(),
    slug: groupSlug,
  };

  beforeEach(async () => {
    repository = inMemoryGroupRepository([group]);
  });

  describe('lookup', () => {
    it('returns nothing when the group does not exist', async () => {
      expect((await repository.lookup(arbitraryGroupId())())).toStrictEqual(O.none);
    });

    it('returns the group when it does exist', async () => {
      const actual = await repository.lookup(groupIdFromString(id))();

      expect(actual).toStrictEqual(O.some(group));
    });
  });

  describe('lookup by slug', () => {
    it('returns nothing when the group does not exist', async () => {
      expect((await repository.lookupBySlug(arbitraryWord())())).toStrictEqual(O.none);
    });

    it('returns the group when it does exist', async () => {
      const actual = await repository.lookupBySlug(groupSlug)();

      expect(actual).toStrictEqual(O.some(group));
    });
  });
});
