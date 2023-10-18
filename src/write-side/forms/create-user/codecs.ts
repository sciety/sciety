import * as tt from 'io-ts-types';
import * as R from 'fp-ts/Record';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { userGeneratedInputCodec, UserGeneratedInput } from '../../../types/user-generated-input';
import { userHandleCodec } from '../../../types/user-handle';

const toFieldsCodec = <P extends t.Props>(props: P) => pipe(
  props,
  R.map(() => t.string),
  (stringProps) => stringProps as { [K in keyof P]: t.StringC },
  t.type,
);

export const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
  handle: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
});

export const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export type CreateUserAccountForm = t.TypeOf<typeof createUserAccountFormCodec>;

export const formFieldsCodec = toFieldsCodec(createUserAccountFormCodec.props);
