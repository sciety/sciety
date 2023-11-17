import { v4 } from 'uuid';
import { EvaluationLocator } from '../../src/types/evaluation-locator.js';
import { arbitraryNumber, arbitraryWord } from '../helpers.js';

export const arbitraryReviewDoi = (): EvaluationLocator => (
  `doi:${arbitraryWord(20)}` as EvaluationLocator
);

const arbitraryHypothesisAnnotationId = (): EvaluationLocator => (
  `hypothesis:${arbitraryWord(20)}` as EvaluationLocator
);

export const arbitraryNcrcId = (): EvaluationLocator => (
  `ncrc:${v4()}` as EvaluationLocator
);

const constructors = [
  arbitraryReviewDoi,
  arbitraryHypothesisAnnotationId,
  arbitraryNcrcId,
];

export const arbitraryEvaluationLocator = (): EvaluationLocator => (
  constructors[arbitraryNumber(0, constructors.length - 1)]()
);
