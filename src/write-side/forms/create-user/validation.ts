import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { userGeneratedInputCodec } from '../../../types/user-generated-input';
import { userHandleCodec } from '../../../types/user-handle';

export type ValidationRecovery<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    name: K,
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

type FormFields = t.TypeOf<typeof formFieldsCodec>;

export const constructValidationRecovery = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: FormFields,
): O.Option<ValidationRecovery<CreateUserAccountForm>> => O.none;
