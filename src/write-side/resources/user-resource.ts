import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { UserHandle } from '../../types/user-handle';
import { DomainEvent, isUserCreatedAccountEvent } from '../../domain-events';

// ts-unused-exports:disable-next-line
export const exists = (userHandle: UserHandle) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle === userHandle),
  RA.match(
    () => false,
    () => true,
  ),
);
