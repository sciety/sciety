import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EditListDetailsCommand } from '../commands';
import { DomainEvent } from '../domain-events';
import { CommitEvents, GetAllEvents } from '../shared-ports';
import { ListAggregate } from '../shared-write-models/list-aggregate';
import { replayListAggregate } from '../shared-write-models/replay-list-aggregate';
import { CommandHandler } from '../types/command-handler';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listAggregate: ListAggregate)
=> ReadonlyArray<DomainEvent>;

const executeCommand: ExecuteCommand = () => () => [];

type EditListDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<EditListDetailsCommand>;

export const editListDetailsCommandHandler: EditListDetailsCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(replayListAggregate(command.listId)),
  TE.map(executeCommand(command)),
  TE.chainTaskK(adapters.commitEvents),
);
