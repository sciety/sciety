import { ErrorMessage, toErrorMessage } from '../../src/types/error-message';
import { arbitraryString } from '../helpers';

export const arbitraryErrorMessage = (): ErrorMessage => toErrorMessage(arbitraryString());
