import endorsements from '../bootstrap-endorsements';
import Doi from '../types/doi';

type GetEndorsingEditorialCommunityIds = (doi: Doi) => Promise<Array<string>>;

export const endorsingEditorialCommunityIds: GetEndorsingEditorialCommunityIds = async (doi) => (
  endorsements[doi.value] ?? []
);

export type GetEndorsedArticleDois = (editorialCommunityId: string) => Promise<Array<Doi>>;

export const endorsedBy: GetEndorsedArticleDois = async (editorialCommunityId) => (
  Object.entries(endorsements)
    .filter((entry) => entry[1]?.includes(editorialCommunityId))
    .map((entry) => new Doi(entry[0]))
);
