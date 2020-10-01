import { Middleware, ParameterizedContext } from 'koa';
import { User } from '../types/user';

export const createRequireAuthentication = (): Middleware<{ user?: User }> => (
  async (context, next) => {
    if (!(context.state.user)) {
      context.session.successRedirect = context.request.headers.referer ?? '/';
      context.redirect('/log-in');
      return;
    }

    await next();
  }
);

export const createRedirectAfterAuthenticating = (): Middleware => (
  async (context: ParameterizedContext, next) => {
    const successRedirect = context.session.successRedirect || '/';
    delete context.session.successRedirect;
    context.redirect(successRedirect);

    await next();
  }
);
