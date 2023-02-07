/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type GetFollowers = (groupId: GroupId) => ReadonlyArray<UserId>;

// ts-unused-exports:disable-next-line
export const getFollowers = (readmodel: ReadModel): GetFollowers => (groupId) => [];
