import Doi from './doi';

type GetEndorsingEditorialCommunityIds = (doi: Doi) => Promise<Array<string>>;

type GetEndorsedArticleDois = (editorialCommunityId: string) => Promise<Array<Doi>>;

export default interface EndorsementsRepository {
  endorsingEditorialCommunityIds: GetEndorsingEditorialCommunityIds;
  endorsedBy: GetEndorsedArticleDois;
}
