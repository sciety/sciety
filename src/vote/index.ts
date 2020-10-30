import { Middleware } from '@koa/router';
import createHandleResponseToReview, { CommitEvents, GetAllEvents } from './handle-response-to-review';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const handleResponseToReview = createHandleResponseToReview(ports.getAllEvents, ports.commitEvents);
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);
  await handleResponseToReview(user, reviewId);

  context.redirect('back');

  await next();
};
