import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { Logger } from './logger';
import { EditorialCommunity } from '../types/editorial-community';
import { eqEditorialCommunityId } from '../types/editorial-community-id';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';

export const createEditorialCommunityRepository = (logger: Logger): EditorialCommunityRepository => {
  const data: Array<EditorialCommunity> = [];

  const result: EditorialCommunityRepository = {
    add: (editorialCommunity) => async () => {
      data.push(editorialCommunity);
      logger('info', 'Editorial community added', { editorialCommunity });
    },

    all: T.of(data),

    lookup: (id) => {
      const candidate = data.find((ec) => eqEditorialCommunityId.equals(ec.id, id));
      return T.of(O.fromNullable(candidate));
    },
  };
  return result;
};
