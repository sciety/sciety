import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe, flow } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { v4 } from 'uuid';

export type GroupId = string & { readonly GroupId: unique symbol };

export const isGroupId = (value: unknown): value is GroupId => typeof value === 'string' && value !== '';

export const fromString = (value: string): O.Option<GroupId> => O.some(value as GroupId);

export const fromValidatedString = (value: string): GroupId => value as GroupId;

export const generate = (): GroupId => fromValidatedString(v4());

export const fromNullable = (value?: string | null): O.Option<GroupId> => pipe(
  value,
  O.fromNullable,
  O.chain(fromString),
);

export const eq: Eq.Eq<GroupId> = S.Eq;

export const GroupIdFromStringCodec = new t.Type(
  'GroupIdFromString',
  isGroupId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      fromString,
      O.match(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => a.toString(),
);
