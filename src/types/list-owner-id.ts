import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { GroupIdFromString } from './codecs/GroupIdFromString';
import { UserIdFromString } from './codecs/UserIdFromString';
import { GroupId } from './group-id';
import { UserId } from './user-id';

export const listOwnerIdCodec = t.union([
  t.type({ value: GroupIdFromString, tag: t.literal('group-id') }),
  t.type({ value: UserIdFromString, tag: t.literal('user-id') }),
]);

export type ListOwnerId = t.TypeOf<typeof listOwnerIdCodec>;

export const fromGroupId = (groupId: GroupId): ListOwnerId => ({ value: groupId, tag: 'group-id' });

export const fromUserId = (userId: UserId): ListOwnerId => ({ value: userId, tag: 'user-id' });

export const eqListOwnerId: Eq.Eq<ListOwnerId> = Eq.struct({ value: S.Eq, tag: S.Eq });

export const toString = (listOwnerId: ListOwnerId): string => `${listOwnerId.tag}:${listOwnerId.value}`;

export const fromValidatedString = (str: string): ListOwnerId => {
  const firstPart = str.split(':')[0];
  return firstPart === 'group-id' ? fromGroupId(str.split(':')[1] as GroupId) : fromUserId(str.split(':')[1] as UserId);
};

const checkStringForTag = (input: string) => {
  if (input.split(':')[0] === 'group-id' || input.split(':')[0] === 'user-id') {
    return true;
  }
  return false;
};

type FromStringCodec = {
  encode: (ownerId: ListOwnerId) => string,
  decode: (input: string) => E.Either<unknown, ListOwnerId>,
};

export const fromStringCodec: FromStringCodec = {
  encode: toString,
  decode: (input) => pipe(
    checkStringForTag(input) ? E.right(input) : E.left(''),
    E.map(fromValidatedString),
  ),
};
