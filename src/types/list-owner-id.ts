import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString';
import { UserIdFromString } from './codecs/UserIdFromString';
import { GroupId } from './group-id';
import { UserId } from './user-id';

const listOwnerIdCodec = t.union([
  t.type({ value: GroupIdFromString, tag: t.literal('group-id') }),
  t.type({ value: UserIdFromString, tag: t.literal('user-id') }),
]);

export type ListOwnerId = t.TypeOf<typeof listOwnerIdCodec>;

export const fromGroupId = (groupId: GroupId): ListOwnerId => ({ value: groupId, tag: 'group-id' });

export const fromUserId = (userId: UserId): ListOwnerId => ({ value: userId, tag: 'user-id' });

export const eqListOwnerId: Eq.Eq<ListOwnerId> = Eq.struct({ value: S.Eq, tag: S.Eq });

export const toString = (listOwnerId: ListOwnerId): string => `${listOwnerId.tag}:${listOwnerId.value}`;

export const fromStringCodec = new t.Type(
  'fromStringCodec',
  listOwnerIdCodec.is,
  (input) => pipe(
    input,
    t.string.decode,
    E.map((str) => str.split(':')),
    E.map((fields) => ({
      tag: fields[0],
      value: fields[1],
    })),
    E.chain(listOwnerIdCodec.decode),
  ),
  toString,
);
