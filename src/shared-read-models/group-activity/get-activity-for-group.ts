/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

type GetActivityForGroup = (groupId: GroupId) => O.Option<{ evaluationCount: number }>;

// ts-unused-exports:disable-next-line
export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => pipe(
  readModel,
  R.lookup(groupId),
);
