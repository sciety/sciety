import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { LookupUser } from '../../shared-ports';

export const lookupUser = (readModel: ReadModel): LookupUser => (handle) => pipe(
  Object.values(readModel),
  RA.findFirst((user) => user.handle.toLocaleLowerCase() === handle.toLowerCase()),
);
