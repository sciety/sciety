import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { executeCommand } from './execute-command';
import { RemoveArticleFromListCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RemoveArticleFromListCommandHandler = (
  adapters: Ports
) => CommandHandler<RemoveArticleFromListCommand>;

export const removeArticleFromListCommandHandler: RemoveArticleFromListCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(executeCommand(command)),
  TE.chainTaskK(adapters.commitEvents),
);
