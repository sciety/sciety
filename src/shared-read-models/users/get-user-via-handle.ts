import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export const getUserViaHandle = (readModel: ReadModel) => (handle: string) => pipe(
  Object.values(readModel),
  RA.findFirst((user) => user.handle === handle),
);
