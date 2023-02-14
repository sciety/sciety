import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { LookupUserByHandle } from '../../shared-ports';

export const lookupUserByHandle = (readModel: ReadModel): LookupUserByHandle => (handle) => pipe(
  Object.values(readModel),
  RA.findFirst((user) => user.handle.toLowerCase() === handle.toLowerCase()),
);
