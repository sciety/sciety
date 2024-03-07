import * as O from 'fp-ts/Option';
import { CreateUserAccountForm, ValidationRecovery } from '../validation';

export type ViewModel = O.Option<ValidationRecovery<CreateUserAccountForm>>;
