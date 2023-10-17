import * as O from 'fp-ts/Option';
import { UserGeneratedInput } from '../../types/user-generated-input';
import { CreateUserAccountForm } from '../../http/forms/validate-and-execute-command';

type ValidationRecovery<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    name: K,
    userInput:
    string,
    error: O.Option<string>,
  }
};

export type ViewModel = {
  pageHeader: string,
  fullName: UserGeneratedInput,
  handle: UserGeneratedInput,
  errorSummary: O.Option<unknown>,
  validationRecovery: O.Option<ValidationRecovery<CreateUserAccountForm>>,
};
