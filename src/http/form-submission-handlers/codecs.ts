import * as tt from 'io-ts-types';
import * as t from 'io-ts';
import { userHandleCodec } from '../../types/user-handle';
import { SanitisedUserInput, sanitisedUserInputCodec } from '../../types/sanitised-user-input';

export const createUserAccountFormCodec = t.type({
  fullName: sanitisedUserInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(sanitisedUserInputCodec({ maxInputLength: 1000 }), '' as SanitisedUserInput),
  handle: tt.withFallback(sanitisedUserInputCodec({ maxInputLength: 1000 }), '' as SanitisedUserInput),
});
