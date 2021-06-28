import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

const authenticate = (strategy: 'twitter' | 'local'): Middleware => koaPassport.authenticate(
  strategy,
  {
    failureRedirect: '/',
  },
);

export const logIn = (strategy: 'twitter' | 'local'): Middleware => {
  switch (strategy) {
    case 'local':
      return async (context, next) => {
        const twitterTestingAccountId = '1338873008283377664';
        context.redirect(`/twitter/callback?username=${twitterTestingAccountId}&password=anypassword`);
        await next();
      };
    case 'twitter':
      return async (context, next) => {
        await authenticate('twitter')(context, next);
      };
  }
};

export const logInCallback = (strategy: 'twitter' | 'local'): Middleware => authenticate(strategy);
