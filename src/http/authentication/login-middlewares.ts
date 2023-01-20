import { Middleware } from 'koa';
import koaPassport from 'koa-passport';

// twitter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const logInTwitter: Middleware = koaPassport.authenticate('twitter', {
  failureRedirect: '/',
});

export const stubLogInTwitter: Middleware = async (context, next) => {
  const twitterTestingAccountId = Math.floor(Math.random() * 1000000 + 1);
  context.redirect(`/twitter/callback?username=${twitterTestingAccountId}&password=anypassword`);
  await next();
};

export const stubLogInTwitterAsSpecificUser: Middleware = async (context, next) => {
  const { userId } = context.query;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  context.redirect(`/twitter/callback?username=${userId}&password=anypassword`);
  await next();
};

export const stubTwitterCallback = koaPassport.authenticate('local', {
  failureRedirect: '/',
});

// auth0 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const signUpAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const stubSignUpAuth0: Middleware = async (context, next) => {
  context.redirect('/auth0/callback');
  await next();
};

export const logInAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});
