import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { Logger } from './logger';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';

export default (logger: Logger): EditorialCommunityRepository => {
  const data: Array<EditorialCommunity> = [];

  const result: EditorialCommunityRepository = {
    add: async (editorialCommunity) => {
      data.push(editorialCommunity);
      logger('info', 'Editorial community added', { editorialCommunity });
    },

    all: T.of(data),

    lookup: (id) => {
      const candidate = data.find((ec) => ec.id.value === id.value);
      return T.of(Maybe.of(candidate));
    },
  };
  return result;
};
