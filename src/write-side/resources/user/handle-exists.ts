import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import { UserHandle } from '../../../types/user-handle';

export const handleExists = (userHandle: UserHandle) => (events: ReadonlyArray<DomainEvent>): boolean => pipe(
  events,
  RA.filter(isEventOfType('UserCreatedAccount')),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle.toLowerCase() === userHandle.toLowerCase()),
  RA.match(
    () => false,
    () => true,
  ),
);
