import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { AddArticleToListCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../shared-ports';
import { replayListAggregate } from '../shared-write-models/replay-list-aggregate';
import { CommandHandler } from '../types/command-handler';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type AddArticleToListCommandHandler = (
  ports: Ports
) => CommandHandler<AddArticleToListCommand>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  ports,
) => (
  command,
) => pipe(
  ports.getAllEvents,
  T.map(replayListAggregate(command.listId)),
  TE.map(executeCommand(command)),
  TE.chainTaskK(ports.commitEvents),
);
