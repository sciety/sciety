import EditorialCommunityId from './editorial-community-id';

export interface EditorialCommunity {
  id: EditorialCommunityId;
  name: string;
  logo: string|undefined;
  description: string;
}
