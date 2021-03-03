import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as EventId from '../event-id';

export const EventIdFromString = new t.Type(
  'EventIdFromString',
  EventId.isEventId,
  (u, c) => pipe(
    tt.UUID.validate(u, c),
    E.chain(flow(
      EventId.fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  String,
);
