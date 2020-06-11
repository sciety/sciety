import { GetEndorsingEditorialCommunities } from './render-search-result';
import endorsements from '../bootstrap-endorsements';

export type GetNameForEditorialCommunity = (id: string) => string;

export default (
  getNameForEditorialCommunity: GetNameForEditorialCommunity,
): GetEndorsingEditorialCommunities => (
  async (doi) => {
    const editorialCommunityIds = endorsements[doi.value] ?? [];
    return editorialCommunityIds.map(getNameForEditorialCommunity);
  }
);
