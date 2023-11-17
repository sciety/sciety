import { arbitraryNumber } from '../helpers.js';
import { EvaluationType, evaluationTypes } from '../../src/types/recorded-evaluation.js';

export const arbitraryEvaluationType = (): EvaluationType => (
  evaluationTypes[arbitraryNumber(0, evaluationTypes.length - 1)]
);
