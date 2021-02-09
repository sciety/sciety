import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { EditorialCommunity } from './editorial-community';
import { EditorialCommunityId } from './editorial-community-id';

export type EditorialCommunityRepository = {
  add(editorialCommunity: EditorialCommunity): T.Task<void>,
  all: T.Task<ReadonlyArray<EditorialCommunity>>,
  lookup(id: EditorialCommunityId): T.Task<O.Option<EditorialCommunity>>,
};
