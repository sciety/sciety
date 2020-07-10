import createEditorialCommunities from '../../src/infrastructure/in-memory-editorial-communities';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';

const editorialCommunityId = 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0';

describe('in-memory-editorial-communities', () => {
  let repository: EditorialCommunityRepository;

  beforeEach(async () => {
    repository = createEditorialCommunities();
  });

  describe('lookup', () => {
    it('returns nothing when the editorial community does not exist', async () => {
      expect((await repository.lookup('no-such-thing')).isNothing()).toBe(true);
    });

    it('returns the editorial community when it does exist', async () => {
      const actual = await repository.lookup(editorialCommunityId);

      expect(actual.isNothing()).toBe(false);
    });
  });
});
