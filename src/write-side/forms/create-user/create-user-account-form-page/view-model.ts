import * as O from 'fp-ts/Option';
import { CreateUserAccountForm, ValidationRecovery } from '../validation';

export type ViewModel = {
  pageHeader: string,
  fullName: string,
  handle: string,
  errorSummary: O.Option<unknown>,
  validationRecovery: O.Option<ValidationRecovery<CreateUserAccountForm>>,
};
