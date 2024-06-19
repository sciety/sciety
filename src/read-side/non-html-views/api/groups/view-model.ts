import * as O from 'fp-ts/Option';

type GroupAdmin = {
  userHandle: string,
};

type GroupStatus = {
  id: string,
  name: string,
  avatarPath: string,
  descriptionPath: string,
  shortDescription: string,
  homepage: string,
  slug: string,
  largeLogoPath: O.Option<string>,
  admins: ReadonlyArray<O.Option<GroupAdmin>>,
};

export type ViewModel = ReadonlyArray<GroupStatus>;
