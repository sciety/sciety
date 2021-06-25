import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

export const authenticate = (strategy: 'twitter' | 'local'): Middleware => koaPassport.authenticate(
  strategy,
  {
    failureRedirect: '/',
  },
);
