import { Maybe } from 'true-myth';
import { Logger } from './logger';
import data from '../data/bootstrap-editorial-communities';
import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (logger: Logger): EditorialCommunityRepository => {
  const editorialCommunities: Array<EditorialCommunity> = data;

  const result: EditorialCommunityRepository = {
    add: async (editorialCommunity) => {
      data.push(editorialCommunity);
      logger('debug', 'Editorial community added', { editorialCommunity });
    },

    all: () => editorialCommunities,
    lookup: async (id) => {
      const candidate = editorialCommunities.find((ec) => ec.id === id);
      return Maybe.of(candidate);
    },
  };
  return result;
};
