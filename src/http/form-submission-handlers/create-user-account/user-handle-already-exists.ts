import * as O from 'fp-ts/Option';
import { FormBody } from './form-body';
import { ViewModel } from '../../../html-pages/create-user-account-form-page/view-model';

export const userHandleAlreadyExists = (formInputs: FormBody): ViewModel => O.some({
  fullName: { userInput: formInputs.fullName, error: O.none },
  handle: { userInput: formInputs.handle, error: O.some('This handle is already taken. Please try a different one.') },
});
