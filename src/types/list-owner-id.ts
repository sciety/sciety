import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString.js';
import { userIdCodec, UserId } from './user-id.js';
import { GroupId } from './group-id.js';

export const fromObjectOfStrings = t.union([
  t.type({ value: GroupIdFromString, tag: t.literal('group-id') }),
  t.type({ value: userIdCodec, tag: t.literal('user-id') }),
]);

export type ListOwnerId = t.TypeOf<typeof fromObjectOfStrings>;

export const fromGroupId = (groupId: GroupId): ListOwnerId => ({ value: groupId, tag: 'group-id' });

export const fromUserId = (userId: UserId): ListOwnerId => ({ value: userId, tag: 'user-id' });

export const isGroupId = (listOwnerId: ListOwnerId): boolean => listOwnerId.tag === 'group-id';

export const eqListOwnerId: Eq.Eq<ListOwnerId> = Eq.struct({ value: S.Eq, tag: S.Eq });

export const toString = (listOwnerId: ListOwnerId): string => `${listOwnerId.tag}:${listOwnerId.value}`;

const fromString = (input: unknown) => pipe(
  input,
  t.string.decode,
  E.map((str) => str.split(':')),
  E.map((fields) => ({
    tag: fields[0],
    value: fields[1],
  })),
  E.chain(fromObjectOfStrings.decode),
);

export const fromStringCodec = new t.Type(
  'fromStringCodec',
  fromObjectOfStrings.is,
  fromString,
  toString,
);
