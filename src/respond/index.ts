import { Middleware } from '@koa/router';
import createHandleResponseToReview, { CommitEvents } from './handle-response-to-review';
import { GetAllEvents, respondHelpful } from './respond-helpful-command';
import { revokeResponse } from './revoke-response-command';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const handleResponseToReview = createHandleResponseToReview(
    respondHelpful(ports.getAllEvents),
    revokeResponse(ports.getAllEvents),
    ports.commitEvents,
  );
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);
  // TODO: validate that command matches HandleResponseToReview
  const { command } = context.request.body;
  await handleResponseToReview(user, reviewId, command);

  context.redirect('back');

  await next();
};
