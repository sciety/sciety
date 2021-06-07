import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as UserId from '../user-id';

export const UserIdFromString = new t.Type(
  'UserIdFromString',
  UserId.isUserId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      UserId.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  identity,
);
