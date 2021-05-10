import { HypothesisAnnotationId } from '../../src/types/hypothesis-annotation-id';
import { arbitraryWord } from '../helpers';

export const arbitraryHypothesisAnnotationId = (): HypothesisAnnotationId => (
  new HypothesisAnnotationId(arbitraryWord(12))
);
