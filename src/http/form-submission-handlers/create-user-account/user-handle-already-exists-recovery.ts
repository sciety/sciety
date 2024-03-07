import * as O from 'fp-ts/Option';
import { CreateUserAccountFormRaw } from './codecs';
import { rawUserInput } from '../../../read-side';
import { Recovery } from '../../../html-pages/create-user-account-form-page/recovery';

export const userHandleAlreadyExistsRecovery = (formInputs: CreateUserAccountFormRaw): Recovery => O.some({
  fullName: { userInput: rawUserInput(formInputs.fullName), error: O.none },
  handle: { userInput: rawUserInput(formInputs.handle), error: O.some('This handle is already taken. Please try a different one.') },
});
