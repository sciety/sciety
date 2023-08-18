import { UpdateEvaluationCommand } from '../../../src/write-side/commands';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../../types/evaluation-type.helper';

export const arbitraryUpdateEvaluationCommand = (): UpdateEvaluationCommand => ({
  evaluationLocator: arbitraryEvaluationLocator(),
  evaluationType: arbitraryEvaluationType(),
});
