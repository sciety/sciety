import { ParameterizedContext } from 'koa';

export const sendRedirect = (
  context: ParameterizedContext,
  redirectTarget: string,
): void => context.redirect(redirectTarget);
