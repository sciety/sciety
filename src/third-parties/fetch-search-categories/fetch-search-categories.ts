import * as TE from 'fp-ts/TaskEither';
import * as DE from '../../types/data-error';

type Titles = ReadonlyArray<string>;

const titles = [
  'Infectious Diseases (except HIV/AIDS)',
  'Epidemiology',
];

export const fetchSearchCategories = (): TE.TaskEither<DE.DataError, Titles> => TE.right(titles);
