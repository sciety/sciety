import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as ListId from '../list-id';

export const ListIdFromString = new t.Type(
  'ListIdFromString',
  ListId.isListId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.map(ListId.fromValidatedString),
  ),
  (a) => a.toString(),
);
