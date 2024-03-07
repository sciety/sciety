import * as O from 'fp-ts/Option';
import { CreateUserAccountFormRaw } from './codecs';
import { Recovery } from '../../../html-pages/create-user-account-form-page/recovery';

export const userHandleAlreadyExistsRecovery = (formInputs: CreateUserAccountFormRaw): Recovery => O.some({
  fullName: { userInput: formInputs.fullName, error: O.none },
  handle: { userInput: formInputs.handle, error: O.some('This handle is already taken. Please try a different one.') },
});
