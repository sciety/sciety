import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as GroupId from '../group-id';

export const GroupIdFromString = new t.Type(
  'GroupIdFromString',
  GroupId.isGroupId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      GroupId.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => a.toString(),
);
