import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Middleware } from 'koa';
import { respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import toReviewId from '../types/review-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const command = context.session.command as string;
  if (command === 'respond-helpful' && context.session.reviewId) {
    const { user } = context.state;
    const reviewId = toReviewId(context.session.reviewId);

    const commands = {
      'respond-helpful': respondHelpful,
      'respond-not-helpful': respondNotHelpful,
      'revoke-response': revokeResponse,
    };

    await pipe(
      ports.getAllEvents,
      T.map(reviewResponse(user.id, reviewId)),
      T.map((currentResponse) => commands[command](currentResponse, user.id, reviewId)),
      T.map(ports.commitEvents),
    )();

    delete context.session.command;
    delete context.session.editorialCommunityId;
  }

  await next();
};
