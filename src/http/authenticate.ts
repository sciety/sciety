import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

export const authenticate = (strategy: 'twitter' | 'local'): Middleware => koaPassport.authenticate(
  strategy,
  {
    failureRedirect: '/',
  },
);

export const logIn = (strategy: 'twitter' | 'local'): Middleware => async (context, next) => {
  switch (strategy) {
    case 'local':
      context.request.query.username = 'a';
      context.request.query.password = 'b';
      context.redirect('/twitter/callback?username=a&password=b');
      return await next();
    case 'twitter':
      return await authenticate('twitter')(context, next);
  }
};
