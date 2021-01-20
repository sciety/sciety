import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { EditorialCommunity } from './editorial-community';
import { EditorialCommunityId } from './editorial-community-id';

export interface EditorialCommunityRepository {
  add(editorialCommunity: EditorialCommunity): Promise<void>;
  all: T.Task<Array<EditorialCommunity>>;
  lookup(id: EditorialCommunityId): T.Task<Maybe<EditorialCommunity>>;
}
