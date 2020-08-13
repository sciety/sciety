import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';

export default interface EndorsementsRepository {
  endorsingEditorialCommunityIds: (doi: Doi) => Promise<Array<EditorialCommunityId>>;
  endorsedBy: (editorialCommunityId: EditorialCommunityId) => Promise<Array<Doi>>;
}
