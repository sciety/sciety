import * as O from 'fp-ts/Option';

type Category = {
  title: string,
  href: string,
};

export type ViewModel = { categories: O.Option<ReadonlyArray<Category>> };
