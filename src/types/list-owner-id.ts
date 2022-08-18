import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString';
import { UserIdFromString } from './codecs/UserIdFromString';

export const listOwnerIdCodec = t.union([GroupIdFromString, UserIdFromString]);
