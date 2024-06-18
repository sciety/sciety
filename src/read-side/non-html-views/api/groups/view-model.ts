type GroupStatus = {
  id: string,
  name: string,
  avatarPath: string,
  descriptionPath: string,
  shortDescription: string,
  homepage: string,
  slug: string,
  largeLogoPath: string,
};

export type ViewModel = {
  groups: ReadonlyArray<GroupStatus>,
};
