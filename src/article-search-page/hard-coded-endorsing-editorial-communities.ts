import { GetEndorsingEditorialCommunities } from './render-search-result';
import endorsements from '../bootstrap-endorsements';

export type GetNameForEditorialCommunity = (id: string) => Promise<string>;

export default (
  getNameForEditorialCommunity: GetNameForEditorialCommunity,
): GetEndorsingEditorialCommunities => (
  async (doi) => {
    const editorialCommunityIds = endorsements[doi.value] ?? [];
    return Promise.all(editorialCommunityIds.map(getNameForEditorialCommunity));
  }
);
