import { ParameterizedContext } from 'koa';
import { RedirectTarget } from '../read-side/html-pages/redirect-target';

export const sendRedirect = (
  context: ParameterizedContext,
  redirectTarget: RedirectTarget,
): void => context.redirect(redirectTarget.target);
