import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';

const titles = [
  'Infectious Diseases (except HIV/AIDS)',
  'Epidemiology',
];

export const constructViewModel = (): ViewModel => pipe(
  titles,
  RA.map((title) => ({
    title,
    href: `https://labs.sciety.org/categories/articles?category=${title}`,
  })),
);
