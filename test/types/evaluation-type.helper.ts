import { arbitraryNumber } from '../helpers';
import { EvaluationType, evaluationTypes } from '../../src/types/recorded-evaluation';

export const arbitraryEvaluationType = (): EvaluationType => (
  evaluationTypes[arbitraryNumber(0, evaluationTypes.length - 1)]
);
