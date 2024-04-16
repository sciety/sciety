import * as E from 'fp-ts/Either';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as User from './handle-exists';
import { DomainEvent } from '../../../domain-events';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { CreateUserAccountCommand } from '../../commands';

export const checkCommand = (
  command: CreateUserAccountCommand,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, CreateUserAccountCommand> => pipe(
  events,
  User.handleExists(command.handle),
  B.match(
    () => E.right(command),
    () => E.left(toErrorMessage('user-handle-already-exists')),
  ),
);
