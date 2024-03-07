import * as O from 'fp-ts/Option';
import { CreateUserAccountForm, ValidationRecovery } from '../validation';

export type CreateUserAccountFormRecovery = O.Option<ValidationRecovery<CreateUserAccountForm>>;
