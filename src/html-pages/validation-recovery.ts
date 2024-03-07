import * as O from 'fp-ts/Option';
import { RawUserInput } from '../read-side';

export type ValidationRecovery<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    userInput: RawUserInput,
    error: O.Option<string>,
  };
};
