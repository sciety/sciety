import { ErrorMessage, toErrorMessage } from '../../src/types/error-message.js';
import { arbitraryString } from '../helpers.js';

export const arbitraryErrorMessage = (): ErrorMessage => toErrorMessage(arbitraryString());
