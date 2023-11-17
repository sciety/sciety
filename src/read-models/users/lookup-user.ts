import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event.js';
import { UserId } from '../../types/user-id.js';
import { UserDetails } from '../../types/user-details.js';

type LookupUser = (userId: UserId) => O.Option<UserDetails>;

export const lookupUser = (readModel: ReadModel): LookupUser => (userId) => pipe(
  readModel,
  R.lookup(userId),
);
