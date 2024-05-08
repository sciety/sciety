import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { userEditableFormFieldsCodec } from '../../http/form-submission-handlers/save-article/form-body';
import { ValidationRecovery } from '../validation-recovery/validation-recovery';

export type Recovery = O.Option<ValidationRecovery<t.TypeOf<typeof userEditableFormFieldsCodec>>>;
