import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export const getUserViaHandle = (readModel: ReadModel) => (handle: string) => pipe(
  readModel,
  R.lookup(handle),
);
