import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GetFollowers } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export const getFollowers = (readmodel: ReadModel): GetFollowers => (groupId) => pipe(
  readmodel,
  R.toEntries,
  RA.filter(([, groupIds]) => groupIds.includes(groupId)),
  RA.map(([uid]) => uid),
);
