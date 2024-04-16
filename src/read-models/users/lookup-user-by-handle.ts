import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { CandidateUserHandle } from '../../types/candidate-user-handle';
import { UserDetails } from '../../types/user-details';

type LookupUserByHandle = (handle: CandidateUserHandle) => O.Option<UserDetails>;

export const lookupUserByHandle = (readModel: ReadModel): LookupUserByHandle => (handle) => pipe(
  Object.values(readModel),
  RA.findFirst((user) => user.handle.toLowerCase() === handle.toLowerCase()),
);
