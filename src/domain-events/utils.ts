import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from './domain-event';

export const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);
