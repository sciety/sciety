import { Maybe } from 'true-myth';
import { Logger } from './logger';
import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (logger: Logger): EditorialCommunityRepository => {
  const data: Array<EditorialCommunity> = [];

  const result: EditorialCommunityRepository = {
    add: async (editorialCommunity) => {
      data.push(editorialCommunity);
      logger('info', 'Editorial community added', { editorialCommunity });
    },

    all: () => data,
    lookup: async (id) => {
      const candidate = data.find((ec) => ec.id === id);
      return Maybe.of(candidate);
    },
  };
  return result;
};
