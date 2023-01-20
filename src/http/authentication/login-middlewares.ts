import * as t from 'io-ts';
import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

const strategyCodec = t.union([
  t.literal('twitter'),
  t.literal('local'),
  t.literal('auth0'),
]);

type Strategy = t.TypeOf<typeof strategyCodec>;

export const logInCallback = (strategy: Strategy): Middleware => {
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

export const logInAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const logInTwitter: Middleware = koaPassport.authenticate('twitter', {
  failureRedirect: '/',
});

export const logInLocal: Middleware = async (context, next) => {
  const twitterTestingAccountId = Math.floor(Math.random() * 1000000 + 1);
  context.redirect(`/twitter/callback?username=${twitterTestingAccountId}&password=anypassword`);
  await next();
};

export const logInAsSpecificUser: Middleware = async (context, next) => {
  const { userId } = context.query;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  context.redirect(`/twitter/callback?username=${userId}&password=anypassword`);
  await next();
};

export const signUpAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});
