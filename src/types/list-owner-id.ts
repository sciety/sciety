import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString';
import { UserIdFromString } from './codecs/UserIdFromString';
import { GroupId } from './group-id';
import { UserId } from './user-id';

export const listOwnerIdCodec = t.union([GroupIdFromString, UserIdFromString]);

export type ListOwnerId = t.TypeOf<typeof listOwnerIdCodec>;

export const fromGroupId = (groupId: GroupId): ListOwnerId => groupId;

export const fromUserId = (userId: UserId): ListOwnerId => userId;
