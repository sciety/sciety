import * as O from 'fp-ts/Option';

type GroupStatus = {
  id: string,
  name: string,
  avatarPath: string,
  descriptionPath: string,
  shortDescription: string,
  homepage: string,
  slug: string,
  largeLogoPath: O.Option<string>,
};

export type ViewModel = ReadonlyArray<GroupStatus>;
