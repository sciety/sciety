import * as O from 'fp-ts/Option';

export type GroupLinkWithLogoViewModel = {
  groupName: string,
  href: string,
  logoPath: O.Option<string>,
};
