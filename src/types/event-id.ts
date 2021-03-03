import * as O from 'fp-ts/Option';
import { v4, validate } from 'uuid';

export type EventId = string & { readonly EventId: unique symbol };

export const isEventId = (value: unknown): value is EventId => typeof value === 'string' && validate(value);

export const generate = (): EventId => v4() as EventId;

export const fromString = O.fromPredicate(isEventId);
