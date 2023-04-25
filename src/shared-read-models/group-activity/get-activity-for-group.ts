/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';

type GetActivityForGroup = (groupId: GroupId) => O.Option<unknown>;

// ts-unused-exports:disable-next-line
export const getActivityForGroup = (readModel: ReadModel): GetActivityForGroup => (groupId) => O.none;
