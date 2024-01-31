import { ParameterizedContext } from 'koa';
import { RedirectTarget } from '../html-pages/redirect-target';

export const sendRedirect = (
  context: ParameterizedContext,
  redirectTarget: RedirectTarget,
): void => context.redirect(redirectTarget);
