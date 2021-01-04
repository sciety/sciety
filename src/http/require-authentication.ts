import { Middleware, ParameterizedContext } from 'koa';
import { User } from '../types/user';

type State = {
  user?: User,
  targetFragmentId?: string,
};

export const createRequireAuthentication = (): Middleware<State> => (
  async (context, next) => {
    if (!(context.state.user)) {
      context.session.successRedirect = context.request.headers.referer ?? '/';
      if (context.state.targetFragmentId) {
        context.session.successRedirect = `${context.session.successRedirect as string}#${context.state.targetFragmentId}`;
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
