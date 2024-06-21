import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

const constructBrowseByCategory = (dependencies: Dependencies) => pipe(
  dependencies.fetchSearchCategories(),
  TE.map(RA.map((title) => ({
    title,
    href: `https://labs.sciety.org/categories/articles?category=${title}`,
  }))),
  T.map((categories) => pipe(
    categories,
    O.fromEither,
  )),
);

export const constructViewModel = (dependencies: Dependencies): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  constructBrowseByCategory(dependencies),
  T.map((browseByCategory) => pipe(
    ({ browseByCategory }),
    E.right,
  )),
);
