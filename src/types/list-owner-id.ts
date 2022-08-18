import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString';
import { UserIdFromString } from './codecs/UserIdFromString';
import { GroupId } from './group-id';
import { UserId } from './user-id';

export const listOwnerIdCodec = t.union([GroupIdFromString, UserIdFromString]);

export type ListOwnerId = GroupId | UserId;
