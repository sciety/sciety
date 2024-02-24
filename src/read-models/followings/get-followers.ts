import * as R from 'fp-ts/Record';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';

type GetFollowers = (groupId: GroupId) => ReadonlyArray<UserId>;

export const getFollowers = (readmodel: ReadModel): GetFollowers => (groupId) => pipe(
  readmodel,
  R.toEntries,
  RA.filter(([, groupIds]) => groupIds.includes(groupId)),
  RA.map(([uid]) => uid),
);
