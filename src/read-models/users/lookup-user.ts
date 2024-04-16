import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { UserDetails } from '../../types/user-details';
import { UserId } from '../../types/user-id';

type LookupUser = (userId: UserId) => O.Option<UserDetails>;

export const lookupUser = (readModel: ReadModel): LookupUser => (userId) => pipe(
  readModel,
  R.lookup(userId),
);
