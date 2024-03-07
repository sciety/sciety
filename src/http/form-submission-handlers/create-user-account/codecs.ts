import * as t from 'io-ts';
import { userHandleCodec } from '../../../types/user-handle';
import { sanitisedUserInputCodec } from '../../../types/sanitised-user-input';

export const createUserAccountFormCodec = t.type({
  fullName: sanitisedUserInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});
