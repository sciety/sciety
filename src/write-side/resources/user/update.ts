import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../../commands';
import { replayUserResource } from './replay-user-resource';
import { executeCommand } from './execute-command';
import { DomainEvent } from '../../../domain-events';
import { ErrorMessage } from '../../../types/error-message';

type Update = (command: UpdateUserDetailsCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const update: Update = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(executeCommand(command)),
);
