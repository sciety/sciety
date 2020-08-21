import createEditorialCommunities from '../../src/infrastructure/in-memory-editorial-communities';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import dummyLogger from '../dummy-logger';

const editorialCommunityId = new EditorialCommunityId('530812a5-838a-4fb2-95b6-eb4828f0d37c');

describe('in-memory-editorial-communities', () => {
  let repository: EditorialCommunityRepository;

  beforeEach(async () => {
    repository = createEditorialCommunities(dummyLogger);
    await repository.add({
      id: editorialCommunityId,
      name: 'My pals',
      avatarUrl: 'https://example.com/images/2',
      descriptionPath: '/static/desc.md',
    });
  });

  describe('lookup', () => {
    it('returns nothing when the editorial community does not exist', async () => {
      expect((await repository.lookup(new EditorialCommunityId('no-such-thing'))).isNothing()).toBe(true);
    });

    it('returns the editorial community when it does exist', async () => {
      const actual = await repository.lookup(new EditorialCommunityId(editorialCommunityId.value));

      expect(actual.isNothing()).toBe(false);
    });
  });
});
