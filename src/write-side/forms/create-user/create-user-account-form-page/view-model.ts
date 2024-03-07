import * as O from 'fp-ts/Option';
import { CreateUserAccountForm } from '../codecs';
import { ValidationRecovery } from '../validation-recovery';

export type ViewModel = O.Option<ValidationRecovery<CreateUserAccountForm>>;
