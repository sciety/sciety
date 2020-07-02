import { Maybe } from 'true-myth';
import { EditorialCommunity } from './editorial-community';

export default interface EditorialCommunityRepository {
  all(): Array<EditorialCommunity>;
  lookup(id: string): Maybe<EditorialCommunity>;
}
