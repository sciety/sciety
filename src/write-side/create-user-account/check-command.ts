import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../commands';
import { DomainEvent, isUserCreatedAccountEvent } from '../../domain-events';
import { toErrorMessage } from '../../types/error-message';

export const checkCommand = (command: CreateUserAccountCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle === command.handle),
  RA.match(
    () => E.right(command),
    () => E.left(toErrorMessage('handle-already-exists')),
  ),
);
