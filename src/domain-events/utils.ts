import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { DomainEvent } from './domain-event';

export const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);

export const byUuid: Ord.Ord<DomainEvent> = pipe(
  S.Ord,
  Ord.contramap((event) => event.id),
);
