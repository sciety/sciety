import { EditorialCommunity } from './editorial-community';

export default interface EditorialCommunityRepository {
  all(): Array<EditorialCommunity>;
  lookup(id: string): EditorialCommunity;
}
