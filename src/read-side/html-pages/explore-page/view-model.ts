import * as O from 'fp-ts/Option';

type Category = {
  title: string,
  href: string,
};

export type ViewModel = {
  pageHeading: string,
  browseByCategory: O.Option<ReadonlyArray<Category>>,
};
