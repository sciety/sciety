import * as t from 'io-ts';
import { userGeneratedInputCodec } from '../../../types/user-generated-input';
import { userHandleCodec } from '../../../types/user-handle';
import { toFieldsCodec } from './validation-recovery';

export const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec({ maxInputLength: 30 }),
  handle: userHandleCodec,
});

export type CreateUserAccountForm = t.TypeOf<typeof createUserAccountFormCodec>;

export const formFieldsCodec = toFieldsCodec(createUserAccountFormCodec.props);

export type FormFields = t.TypeOf<typeof formFieldsCodec>;
