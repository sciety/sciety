import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../third-parties';

export const fetchSearchCategories: ExternalQueries['fetchSearchCategories'] = () => TE.right([
  'Epidemiology',
  'Infectious Diseases (except HIV/AIDS)',
  'Microbiology',
  'Public and Global Health',
  'Neuroscience',
  'Immunology',
]);
