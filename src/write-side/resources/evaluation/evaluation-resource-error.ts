import { toErrorMessage } from '../../../types/error-message';

export const evaluationResourceError = {
  doesNotExist: toErrorMessage('Evaluation does not exist'),
  previouslyRemoved: toErrorMessage('This evaluation has been removed and cannot be recorded again'),
};
