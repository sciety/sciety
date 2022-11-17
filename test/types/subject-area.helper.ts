import { SubjectArea } from '../../src/types/subject-area';
import { arbitraryWord } from '../helpers';

export const arbitrarySubjectArea = (value?: string): SubjectArea => ({
  value: value ?? arbitraryWord(),
  server: 'biorxiv',
});
