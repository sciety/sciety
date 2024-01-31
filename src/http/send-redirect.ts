import { ParameterizedContext } from 'koa';
import { RedirectTarget } from '../html-pages/construct-page';

export const sendRedirect = (
  context: ParameterizedContext,
  redirectTarget: RedirectTarget,
): void => context.redirect(redirectTarget);
