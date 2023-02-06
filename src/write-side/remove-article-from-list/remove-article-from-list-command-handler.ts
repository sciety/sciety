import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { RemoveArticleFromListCommand } from '../commands';
import { ConcurrencySafeCommitEvents, GetAllEvents } from '../../shared-ports';
import { replayListResource } from '../resources/replay-list-resource';
import { CommandHandler } from '../../types/command-handler';

type Ports = {
  getAllEvents: GetAllEvents,
  concurrencySafeCommitEvents: ConcurrencySafeCommitEvents,
};

type RemoveArticleFromListCommandHandler = (
  ports: Ports
) => CommandHandler<RemoveArticleFromListCommand>;

export const removeArticleFromListCommandHandler: RemoveArticleFromListCommandHandler = (
  ports,
) => (
  input,
) => pipe(
  input,
  TE.right,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    TE.rightTask,
    TE.chainEitherK(replayListResource(command.listId)),
    TE.map(executeCommand(command)),
  )),
  TE.chainTaskK(ports.concurrencySafeCommitEvents),
);
