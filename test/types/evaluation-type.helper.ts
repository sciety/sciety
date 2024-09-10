import { EvaluationType, evaluationTypes } from '../../src/types/evaluation-type';
import { arbitraryNumber } from '../helpers';

export const arbitraryEvaluationType = (): EvaluationType => (
  evaluationTypes[arbitraryNumber(0, evaluationTypes.length - 1)]
);
