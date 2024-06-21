import * as O from 'fp-ts/Option';

type Category = {
  title: string,
  href: string,
};

export type ViewModel = { browseByCategory: O.Option<ReadonlyArray<Category>> };
