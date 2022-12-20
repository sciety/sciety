import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

type Strategy = 'twitter' | 'local';

const authenticate = (strategy: Strategy): Middleware => koaPassport.authenticate(
  strategy,
  {
    failureRedirect: '/',
  },
);

export const logIn = (strategy: Strategy): Middleware => {
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

export const logInCallback = (strategy: Strategy): Middleware => authenticate(strategy);

export const logInAsSpecificUser: Middleware = async (context, next) => {
  const { userId } = context.query;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  context.redirect(`/twitter/callback?username=${userId}&password=anypassword`);
  await next();
};
