import { Middleware } from '@koa/router';
import { toRedirectTarget } from '../../html-pages/redirect-target';
import { sendRedirect } from '../../http/send-redirect';

export const redirectToAvatarImageUrl = (): Middleware => async (context, next) => {
  const avatarUrl = toRedirectTarget('/static/images/profile-dark.svg');
  sendRedirect(context, avatarUrl);
  await next();
};
