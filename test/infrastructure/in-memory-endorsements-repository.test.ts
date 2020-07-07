import createEndorsementsRepository from '../../src/infrastructure/in-memory-endorsements-repository';
import Doi from '../../src/types/doi';
import EndorsementsRepository from '../../src/types/endorsements-repository';

const endorsedArticleDoi = new Doi('10.1101/209320');

describe('in-memory-endorsements-repository', () => {
  let repository: EndorsementsRepository;

  beforeEach(async () => {
    repository = createEndorsementsRepository();
    await repository.add(endorsedArticleDoi, '53ed5364-a016-11ea-bb37-0242ac130002');
  });

  describe('endorsedBy', () => {
    it('returns an empty list when the community has endorsed no articles', async () => {
      expect(await repository.endorsedBy('10360d97-bf52-4aef-b2fa-2f60d319edd7')).toHaveLength(0);
    });

    it('returns a complete list when the community has endorsed articles', async () => {
      expect(await repository.endorsedBy('53ed5364-a016-11ea-bb37-0242ac130002')).toHaveLength(1);
    });
  });

  describe('endorsingEditorialCommunityIds', () => {
    it('returns an empty list when the article has no endorsements', async () => {
      expect(await repository.endorsingEditorialCommunityIds(new Doi('10.1111/12345678'))).toHaveLength(0);
    });

    it('returns a complete list when the article has endorsements', async () => {
      expect(await repository.endorsingEditorialCommunityIds(endorsedArticleDoi)).toHaveLength(1);
    });
  });
});
