import * as t from 'io-ts';
import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

const strategyCodec = t.union([
  t.literal('twitter'),
  t.literal('local'),
  t.literal('auth0'),
]);

type Strategy = t.TypeOf<typeof strategyCodec>;

const authenticate = (strategy: Strategy): Middleware => {
  if (strategy === 'auth0') {
    return koaPassport.authenticate(
      strategy,
      {
        failureRedirect: '/',
        scope: 'openid email profile',
      },
    );
  }
  return koaPassport.authenticate(
    strategy,
    {
      failureRedirect: '/',
    },
  );
};

export const logInAuth0: Middleware = async (context, next) => {
  await authenticate('auth0')(context, next);
};

export const logInTwitter: Middleware = async (context, next) => {
  await authenticate('twitter')(context, next);
};

export const logInLocal: Middleware = async (context, next) => {
  const twitterTestingAccountId = Math.floor(Math.random() * 1000000 + 1);
  context.redirect(`/twitter/callback?username=${twitterTestingAccountId}&password=anypassword`);
  await next();
};

export const logInCallback = (strategy: Strategy): Middleware => authenticate(strategy);

export const logInAsSpecificUser: Middleware = async (context, next) => {
  const { userId } = context.query;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  context.redirect(`/twitter/callback?username=${userId}&password=anypassword`);
  await next();
};

export const signUpAuth0: Middleware = async (context, next) => {
  await authenticate('auth0')(context, next);
};
