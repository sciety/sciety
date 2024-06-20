import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

export const constructViewModel = (dependencies: Dependencies): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  dependencies.fetchSearchCategories(),
  TE.map(RA.map((title) => ({
    title,
    href: `https://labs.sciety.org/categories/articles?category=${title}`,
  }))),
);
