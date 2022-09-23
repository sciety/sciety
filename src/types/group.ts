import { GroupId } from './group-id';
import { DescriptionPath } from '../commands/description-path-codec';

export type Group = {
  id: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: DescriptionPath,
  shortDescription: string,
  homepage: string,
  slug: string,
};
