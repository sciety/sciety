import * as t from 'io-ts';
import { userHandleCodec } from '../../../types/user-handle';
import { sanitisedUserInputCodec } from '../../../types/sanitised-user-input';
import { toRawFormCodec } from '../to-fields-codec';

export const createUserAccountFormCodec = t.strict({
  fullName: sanitisedUserInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export type CreateUserAccountForm = t.TypeOf<typeof createUserAccountFormCodec>;

export const createUserAccountFormRawCodec = toRawFormCodec(createUserAccountFormCodec.type.props, 'createUserAccountFormFieldsCodec');

export type CreateUserAccountFormRaw = t.TypeOf<typeof createUserAccountFormRawCodec>;
