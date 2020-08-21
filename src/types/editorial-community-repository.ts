import { Maybe } from 'true-myth';
import { EditorialCommunity } from './editorial-community';
import EditorialCommunityId from './editorial-community-id';

export default interface EditorialCommunityRepository {
  add(editorialCommunity: EditorialCommunity): Promise<void>;
  all(): Promise<Array<EditorialCommunity>>;
  lookup(id: EditorialCommunityId): Promise<Maybe<EditorialCommunity>>;
}
