import { Middleware } from 'koa';
import { User } from '../types/user';

export default (): Middleware<{ user?: User }> => (
  async (context, next) => {
    if (!(context.state.user)) {
      context.session.successRedirect = context.request.headers.referer ?? '/';
      context.redirect('/sign-in');
      return;
    }

    await next();
  }
);
