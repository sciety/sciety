import * as tt from 'io-ts-types';
import * as t from 'io-ts';
import { userGeneratedInputCodec, UserGeneratedInput } from '../../../types/user-generated-input';
import { userHandleCodec } from '../../../types/user-handle';

export const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
  handle: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
});

export const formFieldsCodec = t.type({
  fullName: t.string,
  handle: t.string,
});

export const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export type CreateUserAccountForm = t.TypeOf<typeof createUserAccountFormCodec>;
