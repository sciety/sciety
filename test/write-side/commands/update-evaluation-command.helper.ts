import { UpdateEvaluationCommand } from '../../../src/write-side/commands';
import { arbitraryEvaluationType } from '../../domain-events/types/evaluation-type.helper';
import { arbitraryWord } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

export const arbitraryUpdateEvaluationCommand = (): UpdateEvaluationCommand => ({
  evaluationLocator: arbitraryEvaluationLocator(),
  evaluationType: arbitraryEvaluationType(),
  authors: [arbitraryWord()],
});
