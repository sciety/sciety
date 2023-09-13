import * as O from 'fp-ts/Option';

export type ViewModel = {
  groupName: string,
  href: string,
  logoPath: O.Option<string>,
};
