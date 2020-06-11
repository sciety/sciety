import { GetEndorsingEditorialCommunities } from './render-search-result';

export type GetNameForEditorialCommunity = (id: string) => string;

export default (
  getNameForEditorialCommunity: GetNameForEditorialCommunity,
): GetEndorsingEditorialCommunities => (
  async (doi) => {
    const endorsements: Record<string, Array<string>|undefined> = {
      '10.1101/209320': ['53ed5364-a016-11ea-bb37-0242ac130002'],
      '10.1101/312330': ['53ed5364-a016-11ea-bb37-0242ac130002'],
    };
    const editorialCommunityIds = endorsements[doi.value] ?? [];
    return editorialCommunityIds.map(getNameForEditorialCommunity);
  }
);
