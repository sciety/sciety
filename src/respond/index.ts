import { Middleware } from '@koa/router';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import createHandleResponseToReview, { CommitEvents } from './handle-response-to-review';
import { GetAllEvents, respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  const currentResponse = await pipe(
    ports.getAllEvents,
    T.map(reviewResponse(user.id, reviewId)),
  )();

  const handleResponseToReview = createHandleResponseToReview(
    respondHelpful(currentResponse),
    revokeResponse(ports.getAllEvents),
    respondNotHelpful(ports.getAllEvents),
    ports.commitEvents,
  );
  // TODO: validate that command matches HandleResponseToReview
  const { command } = context.request.body;
  await handleResponseToReview(user, reviewId, command);

  context.redirect('back');

  await next();
};
