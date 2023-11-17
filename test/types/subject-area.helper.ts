import { SubjectArea } from '../../src/types/subject-area.js';
import { arbitraryWord } from '../helpers.js';

export const arbitrarySubjectArea = (value?: string): SubjectArea => ({
  value: value ?? arbitraryWord(),
  server: 'biorxiv',
});
