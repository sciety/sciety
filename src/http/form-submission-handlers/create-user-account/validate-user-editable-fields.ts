import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { CreateUserAccountFormRaw, createUserAccountFormCodec } from './codecs';
import { ValidationRecovery } from '../../../html-pages/validation-recovery/validation-recovery';

const validateFullName = (fullName: string) => {
  if (fullName.length === 0) {
    return O.some('Enter your full name');
  }
  if (/[<>"]/.test(fullName)) {
    return O.some('Full name must not contain any of these chacters: "<>');
  }
  if (fullName.length > 30) {
    return O.some('Full name must be 30 characters or less');
  }
  return O.none;
};

const validateHandle = (handle: string) => {
  if (handle.length === 0) {
    return O.some('Enter a handle');
  }
  if (handle.match('^[a-zA-Z0-9_]+$') === null) {
    return O.some('Your handle may only contain the letters a-z (lower or upper case), numbers and underscores');
  }
  if (handle.length < 4 || handle.length > 15) {
    return O.some('Your handle must be 4-15 characters long');
  }
  return O.none;
};

export const validateUserEditableFields = (
  input: CreateUserAccountFormRaw,
): ValidationRecovery<t.TypeOf<typeof createUserAccountFormCodec>> => ({
  fullName: {
    userInput: input.fullName,
    error: validateFullName(input.fullName.content),
  },
  handle: {
    userInput: input.handle,
    error: validateHandle(input.handle.content),
  },
});
