import { GetEndorsingEditorialCommunityNames } from './render-search-result';
import { endorsingEditorialCommunityIds } from '../infrastructure/in-memory-endorsements-repository';

export type GetNameForEditorialCommunity = (id: string) => Promise<string>;

export default (
  getNameForEditorialCommunity: GetNameForEditorialCommunity,
): GetEndorsingEditorialCommunityNames => (
  async (doi) => {
    const editorialCommunityIds = await endorsingEditorialCommunityIds(doi);
    return Promise.all(editorialCommunityIds.map(getNameForEditorialCommunity));
  }
);
