import { v4 } from 'uuid';

export type EventId = string & { readonly EventId: unique symbol };

export const generate = (): EventId => v4() as EventId;
