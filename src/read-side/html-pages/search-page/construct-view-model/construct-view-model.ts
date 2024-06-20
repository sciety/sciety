import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchSearchCategories } from '../../../../third-parties/fetch-search-categories';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

export const constructViewModel = (): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  fetchSearchCategories(),
  TE.map(RA.map((title) => ({
    title,
    href: `https://labs.sciety.org/categories/articles?category=${title}`,
  }))),
);
