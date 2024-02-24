import { UpdateEvaluationCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryWord } from '../../helpers.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { arbitraryEvaluationType } from '../../types/evaluation-type.helper.js';

export const arbitraryUpdateEvaluationCommand = (): UpdateEvaluationCommand => ({
  evaluationLocator: arbitraryEvaluationLocator(),
  evaluationType: arbitraryEvaluationType(),
  authors: [arbitraryWord()],
});
