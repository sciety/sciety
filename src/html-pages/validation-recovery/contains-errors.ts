import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import { ValidationRecovery } from './validation-recovery';

export const containsErrors = <A extends Record<string, unknown>>(recovery: ValidationRecovery<A>): boolean => pipe(
  recovery,
  R.map((entry) => entry.error),
  R.toEntries,
  RA.map((entry) => entry[1]),
  RA.some(O.isSome),
);
