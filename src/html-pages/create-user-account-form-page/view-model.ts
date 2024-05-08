import * as O from 'fp-ts/Option';
import { ValidationRecovery } from '../validation-recovery/validation-recovery';
import { FormBody } from '../../http/form-submission-handlers/create-user-account/form-body';

export type ViewModel = O.Option<ValidationRecovery<FormBody>>;
