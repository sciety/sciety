import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { UserId } from '../../types/user-id';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';

export type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

const commands = {
  'respond-helpful': respondHelpful,
  'respond-not-helpful': respondNotHelpful,
  'revoke-response': revokeResponse,
};

export const commandCodec = t.keyof(commands);

type Command = t.TypeOf<typeof commandCodec>;

type RespondCommand = {
  command: Command,
  reviewId: EvaluationLocator,
  userId: UserId,
};

export const commandHandler = (ports: Ports): CommandHandler<RespondCommand> => (input) => pipe(
  ports.getAllEvents,
  T.chain(flow(
    reviewResponse(input.userId, input.reviewId),
    (currentResponse) => commands[input.command](currentResponse, input.userId, input.reviewId),
    ports.commitEvents,
  )),
  TE.rightTask,
);
