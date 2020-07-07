import Doi from './doi';

type AddEndorsement = (doi: Doi, editorialCommunityId: string) => Promise<void>;
type GetEndorsingEditorialCommunityIds = (doi: Doi) => Promise<Array<string>>;
type GetEndorsedArticleDois = (editorialCommunityId: string) => Promise<Array<Doi>>;

export default interface EndorsementsRepository {
  add: AddEndorsement;
  endorsingEditorialCommunityIds: GetEndorsingEditorialCommunityIds;
  endorsedBy: GetEndorsedArticleDois;
}
