import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { DomainEvent } from './gubbins';

const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);
const byUuid: Ord.Ord<DomainEvent> = pipe(
  S.Ord,
  Ord.contramap((event) => event.id),
);

export const sort = A.sortBy([byDate, byUuid]);
