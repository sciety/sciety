import { v4 } from 'uuid';
import { EvaluationLocator } from '../../src/types/evaluation-locator';
import { arbitraryNumber, arbitraryWord } from '../helpers';

const arbitraryReviewDoi = (): EvaluationLocator => (
  `doi:10.${arbitraryNumber(1000, 9999)}/${arbitraryWord(20)}` as EvaluationLocator
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
