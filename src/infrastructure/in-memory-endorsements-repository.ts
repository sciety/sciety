import endorsements from '../bootstrap-endorsements';
import Doi from '../types/doi';

export type GetEndorsedArticles = (editorialCommunityId: string) => Promise<Array<Doi>>;

export const endorsedBy: GetEndorsedArticles = async (editorialCommunityId) => (
  Object.entries(endorsements)
    .filter((entry) => entry[1]?.includes(editorialCommunityId))
    .map((entry) => new Doi(entry[0]))
);
