import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { executeCommand } from './execute-command';
import { EditListDetailsCommand } from '../../commands';
import { CommitEvents, GetAllEvents } from '../../../shared-ports';
import { replayListResource } from './replay-list-resource';
import { CommandHandler } from '../../../types/command-handler';
import { DomainEvent } from '../../../domain-events';
import { ErrorMessage } from '../../../types/error-message';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type ResourceAction = (command: EditListDetailsCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

const resourceAction: ResourceAction = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(executeCommand(command)),
);

type EditListDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<EditListDetailsCommand>;

export const editListDetailsCommandHandler: EditListDetailsCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(resourceAction(command)),
  TE.chainTaskK(adapters.commitEvents),
);
