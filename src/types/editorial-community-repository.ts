import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { EditorialCommunity } from './editorial-community';
import { EditorialCommunityId } from './editorial-community-id';

export type EditorialCommunityRepository = {
  all: T.Task<RNEA.ReadonlyNonEmptyArray<EditorialCommunity>>,
  lookup(id: EditorialCommunityId): T.Task<O.Option<EditorialCommunity>>,
};
