import createEndorsementsRepository from '../../src/infrastructure/in-memory-endorsements-repository';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import EndorsementsRepository from '../../src/types/endorsements-repository';

const endorsedArticleDoi = new Doi('10.1101/209320');
const editorialCommunity1Id = new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002');
const editorialCommunity2Id = new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd7');

describe('in-memory-endorsements-repository', () => {
  let repository: EndorsementsRepository;

  beforeEach(async () => {
    repository = createEndorsementsRepository([
      {
        type: 'EditorialCommunityEndorsedArticle',
        date: new Date(),
        actorId: editorialCommunity1Id,
        editorialCommunityId: editorialCommunity1Id,
        articleId: endorsedArticleDoi,
      },
    ]);
  });

  describe('endorsedBy', () => {
    it('returns an empty list when the community has endorsed no articles', async () => {
      expect(await repository.endorsedBy(editorialCommunity2Id)).toHaveLength(0);
    });

    it('returns a complete list when the community has endorsed articles', async () => {
      expect(await repository.endorsedBy(new EditorialCommunityId(editorialCommunity1Id.value))).toHaveLength(1);
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
