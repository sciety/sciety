import { Middleware } from '@koa/router';
import createGetUserResponseToReview, { GetAllEvents } from './get-user-response-to-review';
import createHandleResponseToReview, { CommitEvents } from './handle-response-to-review';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const getUserResponseToReview = createGetUserResponseToReview(ports.getAllEvents);
  const handleResponseToReview = createHandleResponseToReview(getUserResponseToReview, ports.commitEvents);
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);
  // TODO: validate that command matches HandleResponseToReview
  const { command } = context.request.body;
  await handleResponseToReview(user, reviewId, command);

  context.redirect('back');

  await next();
};
