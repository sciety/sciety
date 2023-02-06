import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { AddArticleToListCommand } from '../commands';
import { ConcurrencySafeCommitEvents, GetAllEvents } from '../../shared-ports';
import { replayListResource } from '../resources/replay-list-resource';
import { CommandHandler } from '../../types/command-handler';

export type Ports = {
  getAllEvents: GetAllEvents,
  concurrencySafeCommitEvents: ConcurrencySafeCommitEvents,
};

type AddArticleToListCommandHandler = (
  adapters: Ports
) => CommandHandler<AddArticleToListCommand>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(replayListResource(command.listId)),
  TE.map(executeCommand(command)),
  TE.chainTaskK(adapters.concurrencySafeCommitEvents),
);
