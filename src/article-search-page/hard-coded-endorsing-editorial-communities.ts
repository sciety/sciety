import { GetEndorsingEditorialCommunities } from './render-search-result';

export type GetNameForEditorialCommunity = (id: string) => string;

export default (
  getNameForEditorialCommunity: GetNameForEditorialCommunity,
): GetEndorsingEditorialCommunities => (
  async (doi) => (
    doi.value === '10.1101/209320' ? [await getNameForEditorialCommunity('53ed5364-a016-11ea-bb37-0242ac130002')] : []
  )
);
