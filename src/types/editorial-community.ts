import { GroupId } from './editorial-community-id';

export type EditorialCommunity = {
  id: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: string,
};
