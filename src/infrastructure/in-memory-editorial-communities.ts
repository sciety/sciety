import { Maybe } from 'true-myth';
import data from '../data/bootstrap-editorial-communities';
import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (): EditorialCommunityRepository => {
  const editorialCommunities: Array<EditorialCommunity> = data;

  const result: EditorialCommunityRepository = {
    all: () => editorialCommunities,
    lookup: async (id) => {
      const candidate = editorialCommunities.find((ec) => ec.id === id);
      return Maybe.of(candidate);
    },
  };
  return result;
};
