import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../external-queries';

const titles = [
  'Infectious Diseases (except HIV/AIDS)',
  'Epidemiology',
];

export const fetchSearchCategories: ExternalQueries['fetchSearchCategories'] = () => TE.right(titles);
