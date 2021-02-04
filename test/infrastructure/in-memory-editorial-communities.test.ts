import * as O from 'fp-ts/Option';
import { createEditorialCommunityRepository } from '../../src/infrastructure/in-memory-editorial-communities';
import { EditorialCommunity } from '../../src/types/editorial-community';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { EditorialCommunityRepository } from '../../src/types/editorial-community-repository';
import { dummyLogger } from '../dummy-logger';

const editorialCommunityId = new EditorialCommunityId('530812a5-838a-4fb2-95b6-eb4828f0d37c');

describe('in-memory-editorial-communities', () => {
  let repository: EditorialCommunityRepository;
  const community: EditorialCommunity = {
    id: editorialCommunityId,
    name: 'My pals',
    avatarPath: '',
    descriptionPath: '/static/desc.md',
  };

  beforeEach(async () => {
    repository = createEditorialCommunityRepository(dummyLogger);
    await repository.add(community)();
  });

  describe('lookup', () => {
    it('returns nothing when the editorial community does not exist', async () => {
      expect((await repository.lookup(new EditorialCommunityId('no-such-thing'))())).toStrictEqual(O.none);
    });

    it('returns the editorial community when it does exist', async () => {
      const actual = await repository.lookup(new EditorialCommunityId(editorialCommunityId.value))();

      expect(actual).toStrictEqual(O.some(community));
    });
  });
});
