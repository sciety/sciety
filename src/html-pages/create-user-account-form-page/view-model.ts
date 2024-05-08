import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { ValidationRecovery } from '../validation-recovery/validation-recovery';
import { createUserAccountFormCodec } from '../../http/form-submission-handlers/create-user-account/codecs';

export type ViewModel = O.Option<ValidationRecovery<t.TypeOf<typeof createUserAccountFormCodec>>>;
