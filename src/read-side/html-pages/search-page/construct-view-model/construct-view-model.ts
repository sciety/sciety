import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

const titles = [
  'Infectious Diseases (except HIV/AIDS)',
  'Epidemiology',
];

export const constructViewModel = (): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  TE.right(titles),
  TE.map(RA.map((title) => ({
    title,
    href: `https://labs.sciety.org/categories/articles?category=${title}`,
  }))),
);
