import { v4, validate } from 'uuid';

export type EventId = string & { readonly EventId: unique symbol };

const isEventId = (value: string): value is EventId => validate(value);

const toEventId = (value: string): EventId => {
  if (!isEventId(value)) {
    throw new Error(`'${value}' is not an event ID`);
  }

  return value;
};

export const generate = (): EventId => toEventId(v4());

export default toEventId;
