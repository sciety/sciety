import { evaluationTypes, EvaluationType } from '../../../src/domain-events/types/evaluation-type';
import { arbitraryNumber } from '../../helpers';

export const arbitraryEvaluationType = (): EvaluationType => (
  evaluationTypes[arbitraryNumber(0, evaluationTypes.length - 1)]
);
