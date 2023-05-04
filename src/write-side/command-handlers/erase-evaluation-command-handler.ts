import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { EraseEvaluationCommand } from '../commands';
import * as evaluationResource from '../resources/evaluation';

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
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(evaluationResource.erase(command)),
  TE.chainTaskK(adapters.commitEvents),
);
