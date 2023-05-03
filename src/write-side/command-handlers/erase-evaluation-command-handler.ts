import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { EraseEvaluationCommand } from '../commands';
import { toErrorMessage } from '../../types/error-message';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type EraseEvaluationCommandHandler = (
  adapters: Ports
) => CommandHandler<EraseEvaluationCommand>;

export const eraseEvaluationCommandHandler: EraseEvaluationCommandHandler = (
  adapters,
) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(() => E.left(toErrorMessage('not implemented'))),
  TE.chainTaskK(adapters.commitEvents),
);
