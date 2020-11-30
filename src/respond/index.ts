import { Middleware } from '@koa/router';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { GetAllEvents, respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { RuntimeGeneratedEvent } from '../types/domain-events';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  // TODO: validate that command matches HandleResponseToReview
  const { command } = context.request.body;
  await pipe(
    ports.getAllEvents,
    T.map(reviewResponse(user.id, reviewId)),
    T.map((currentResponse) => {
      switch (command) {
        case 'respond-helpful':
          return respondHelpful(currentResponse)(user.id, reviewId);
        case 'revoke-response':
          return revokeResponse(currentResponse)(user.id, reviewId);
        case 'respond-not-helpful':
          return respondNotHelpful(currentResponse)(user.id, reviewId);
        default:
          return [];
      }
    }),
    T.map(ports.commitEvents),
  )();

  context.redirect('back');

  await next();
};
