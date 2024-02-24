import * as O from 'fp-ts/Option';
import { DescriptionPath } from './description-path.js';
import { GroupId } from './group-id.js';

export type Group = {
  id: GroupId,
  name: string,
  avatarPath: string,
  descriptionPath: DescriptionPath,
  shortDescription: string,
  homepage: string,
  slug: string,
  largeLogoPath: O.Option<string>,
};
