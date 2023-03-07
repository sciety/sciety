import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { CommandResult } from '../../types/command-result';
import { ReviewId } from '../../types/review-id';
import { UserId } from '../../types/user-id';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

const commands = {
  'respond-helpful': respondHelpful,
  'respond-not-helpful': respondNotHelpful,
  'revoke-response': revokeResponse,
};

export const commandCodec = t.keyof(commands);

type Command = t.TypeOf<typeof commandCodec>;

type CommandHandler = (input: { command: Command, reviewId: ReviewId }) => T.Task<CommandResult>;

export const commandHandler = (
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
  userId: UserId,
): CommandHandler => ({
  command,
  reviewId,
}) => pipe(
  getAllEvents,
  T.chain(flow(
    reviewResponse(userId, reviewId),
    (currentResponse) => commands[command](currentResponse, userId, reviewId),
    commitEvents,
  )),
);
