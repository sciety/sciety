import { Annotation } from '../../src/ingest/evaluation-discovery/hypothesis/annotation';
import { arbitraryUri, arbitraryWord } from '../helpers';

export const arbitraryAnnotation = (): Annotation => ({
  id: arbitraryWord(),
  created: arbitraryWord(),
  uri: arbitraryUri(),
  text: arbitraryWord(),
  tags: [arbitraryWord()],
});
