import { Middleware } from '@koa/router';
import { toRedirectTarget } from '../../html-pages/redirect-target';
import { sendRedirect } from '../../http/send-redirect';
import { Queries } from '../../read-models';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const redirectToAvatarImageUrl = (queries: Queries): Middleware => async (context, next) => {
  const avatarUrl = toRedirectTarget('/static/images/profile-dark.svg');
  sendRedirect(context, avatarUrl);
  await next();
};
