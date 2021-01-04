import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { BadRequest } from 'http-errors';
import { Middleware } from 'koa';
import {
  commandHandler, CommitEvents, GetAllEvents, validateCommand, ValidCommand,
} from './command-handler';
import toReviewId from '../types/review-id';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const command = context.session.command as string;
  const validatedCommand = validateCommand(command);
  if (
    O.isSome(validatedCommand) && context.session.reviewId
  ) {
    const { user } = context.state;
    const reviewId = toReviewId(context.session.reviewId);

    await commandHandler(
      ports.commitEvents,
      ports.getAllEvents,
      pipe(
        validatedCommand,
        O.getOrElse<ValidCommand>(() => { throw new BadRequest(); }),
      ),
      user.id,
      reviewId,
    )();

    delete context.session.command;
    delete context.session.editorialCommunityId;
  }

  await next();
};
