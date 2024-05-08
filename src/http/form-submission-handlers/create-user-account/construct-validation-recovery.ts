import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountFormRaw, createUserAccountFormCodec } from './codecs';
import { ViewModel } from '../../../html-pages/create-user-account-form-page/view-model';

const determineFullNameErrorMessage = (fullName: string) => {
  if (fullName.length === 0) {
    return O.some('Enter your full name');
  }
  if (/[<>"]/.test(fullName)) {
    return O.some('Full name must not contain any of these chacters: "<>');
  }
  if (fullName.length > 30) {
    return O.some('Full name must be 30 characters or less');
  }
  return O.some('Your full name is invalid but we do not know why');
};

const determineHandleErrorMessage = (handle: string) => {
  if (handle.length === 0) {
    return O.some('Enter a handle');
  }
  if (handle.match('^[a-zA-Z0-9_]+$') === null) {
    return O.some('Your handle may only contain the letters a-z (lower or upper case), numbers and underscores');
  }
  if (handle.length < 4 || handle.length > 15) {
    return O.some('Your handle must be 4-15 characters long');
  }
  return O.some('Your handle is invalid but we do not know why');
};

export const constructValidationRecovery = (
  input: CreateUserAccountFormRaw,
): ViewModel => O.some({
  fullName: {
    userInput: input.fullName,
    error: pipe(
      input.fullName.content,
      createUserAccountFormCodec.type.props.fullName.decode,
      E.match(
        () => determineFullNameErrorMessage(input.fullName.content),
        () => O.none,
      ),
    ),
  },
  handle: {
    userInput: input.handle,
    error: pipe(
      input.handle.content,
      createUserAccountFormCodec.type.props.handle.decode,
      E.match(
        () => determineHandleErrorMessage(input.handle.content),
        () => O.none,
      ),
    ),
  },
});
