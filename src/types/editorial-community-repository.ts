import { Maybe } from 'true-myth';
import { EditorialCommunity } from './editorial-community';

export default interface EditorialCommunityRepository {
  add(editorialCommunity: EditorialCommunity): Promise<void>;
  all(): Array<EditorialCommunity>;
  lookup(id: string): Promise<Maybe<EditorialCommunity>>;
}
