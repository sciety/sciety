import { SubjectArea } from '../../src/types/subject-area';
import { arbitraryWord } from '../helpers';

export const arbitrarySubjectArea = (): SubjectArea => ({
  value: arbitraryWord(),
  server: 'biorxiv',
});
