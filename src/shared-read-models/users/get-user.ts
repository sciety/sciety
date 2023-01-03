import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { UserId } from '../../types/user-id';

// ts-unused-exports:disable-next-line
export const getUser = (readModel: ReadModel) => (userId: UserId) => pipe(
  readModel,
  R.lookup(userId),
);
