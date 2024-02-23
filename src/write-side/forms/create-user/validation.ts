import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { emptyRegex, userGeneratedInputCodec } from '../../../types/user-generated-input';
import { userHandleCodec } from '../../../types/user-handle';

export type ValidationRecovery<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    userInput:
    string,
    error: O.Option<string>,
  }
};

const toFieldsCodec = <P extends t.Props>(props: P) => pipe(
  props,
  R.map(() => t.string),
  (stringProps) => stringProps as { [K in keyof P]: t.StringC },
  t.type,
);

export const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export type CreateUserAccountForm = t.TypeOf<typeof createUserAccountFormCodec>;

export const formFieldsCodec = toFieldsCodec(createUserAccountFormCodec.props);

const determineFullNameErrorMessage = (fullName: string) => {
  if (fullName.length === 0) {
    return O.some('Enter your full name');
  }
  if (!emptyRegex.exec(fullName)) {
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
  if (!emptyRegex.exec(handle)) {
    return O.some('Your handle must not contain any of these chacters: "<>');
  }
  if (handle.length < 4 || handle.length > 15) {
    return O.some('Your handle must be 4-15 characters long');
  }
  return O.some('Your handle is invalid but we do not know why');
};

type FormFields = t.TypeOf<typeof formFieldsCodec>;

export const constructValidationRecovery = (
  input: FormFields,
): O.Option<ValidationRecovery<CreateUserAccountForm>> => O.some({
  fullName: {
    userInput: input.fullName,
    error: pipe(
      input.fullName,
      createUserAccountFormCodec.props.fullName.decode,
      E.match(
        () => determineFullNameErrorMessage(input.fullName),
        () => O.none,
      ),
    ),
  },
  handle: {
    userInput: input.handle,
    error: pipe(
      input.handle,
      createUserAccountFormCodec.props.handle.decode,
      E.match(
        () => determineHandleErrorMessage(input.handle),
        () => O.none,
      ),
    ),
  },
});
