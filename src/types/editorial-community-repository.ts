import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { EditorialCommunity } from './editorial-community';
import { GroupId } from './editorial-community-id';

export type EditorialCommunityRepository = {
  all: T.Task<RNEA.ReadonlyNonEmptyArray<EditorialCommunity>>,
  lookup(id: GroupId): T.Task<O.Option<EditorialCommunity>>,
};
