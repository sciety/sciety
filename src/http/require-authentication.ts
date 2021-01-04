import { Middleware, ParameterizedContext } from 'koa';
import { User } from '../types/user';

export const createRequireAuthentication = (): Middleware<{ user?: User }> => (
  async (context, next) => {
    if (!(context.state.user)) {
      context.session.successRedirect = context.request.headers.referer ?? '/';
      if (context.session.targetFragmentId) {
        context.session.successRedirect = `${context.session.successRedirect as string}#${context.session.targetFragmentId as string}`;
        delete context.session.targetFragmentId;
      }
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
