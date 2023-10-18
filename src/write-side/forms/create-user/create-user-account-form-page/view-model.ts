import * as O from 'fp-ts/Option';
import { CreateUserAccountForm, ValidationRecovery } from '../validation';

export type ViewModel = {
  validationRecovery: O.Option<ValidationRecovery<CreateUserAccountForm>>,
};
