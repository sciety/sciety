import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { ValidationRecovery } from '../validation-recovery';
import { createUserAccountFormCodec } from '../../http/form-submission-handlers/create-user-account/codecs';

export type Recovery = O.Option<ValidationRecovery<t.TypeOf<typeof createUserAccountFormCodec>>>;
