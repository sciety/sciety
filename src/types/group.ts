import { GroupId } from './group-id';

export type Group = {
  id: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: string,
  shortDescription: string,
  homepage: string,
  slug: string,
};
