import * as O from 'fp-ts/Option';
import { UserGeneratedInput } from '../../types/user-generated-input';

export type ViewModel = {
  pageHeader: string,
  fullName: UserGeneratedInput,
  handle: UserGeneratedInput,
  errorSummary: O.Option<unknown>,
};
