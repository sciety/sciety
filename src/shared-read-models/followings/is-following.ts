/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type IsFollowing = (groupId: GroupId) => (userId: UserId) => boolean;

// ts-unused-exports:disable-next-line
export const isFollowing = (readmodel: ReadModel): IsFollowing => (groupId) => (userId) => false;
