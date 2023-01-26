import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GetUserViaHandle } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export const getUserViaHandle = (readModel: ReadModel): GetUserViaHandle => (handle) => pipe(
  Object.values(readModel),
  RA.findFirst((user) => user.handle === handle),
);
