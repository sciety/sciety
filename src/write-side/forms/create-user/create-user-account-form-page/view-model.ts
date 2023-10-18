import * as O from 'fp-ts/Option';
import { CreateUserAccountForm, ValidationRecovery } from '../validation';

export type ViewModel = {
  pageHeader: string,
  validationRecovery: O.Option<ValidationRecovery<CreateUserAccountForm>>,
};
