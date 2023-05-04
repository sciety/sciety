import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import { UserId } from '../../types/user-id';
import { UserDetails } from '../../types/user-details';

export type LookupUser = (userId: UserId) => O.Option<UserDetails>;

export const lookupUser = (readModel: ReadModel) => (userId: UserId) => pipe(
  readModel,
  R.lookup(userId),
);
