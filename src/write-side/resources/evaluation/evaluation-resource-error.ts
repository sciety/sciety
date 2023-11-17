import { toErrorMessage } from '../../../types/error-message.js';

export const evaluationResourceError = {
  doesNotExist: toErrorMessage('Evaluation does not exist'),
  previouslyRemovedCannotRecord: toErrorMessage('This evaluation has been removed and cannot be recorded again'),
  previouslyRemovedCannotUpdate: toErrorMessage('This evaluation has been removed and cannot be updated'),
};
