import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';

type AddEndorsement = (doi: Doi, editorialCommunityId: EditorialCommunityId) => Promise<void>;
type GetEndorsingEditorialCommunityIds = (doi: Doi) => Promise<Array<EditorialCommunityId>>;
type GetEndorsedArticleDois = (editorialCommunityId: EditorialCommunityId) => Promise<Array<Doi>>;

export default interface EndorsementsRepository {
  add: AddEndorsement;
  endorsingEditorialCommunityIds: GetEndorsingEditorialCommunityIds;
  endorsedBy: GetEndorsedArticleDois;
}
