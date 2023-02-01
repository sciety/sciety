import { Middleware } from 'koa';
import * as O from 'fp-ts/Option';
import koaPassport from 'koa-passport';
import { pipe } from 'fp-ts/function';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

// twitter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const logInTwitter: Middleware = koaPassport.authenticate('twitter', {
  failureRedirect: '/',
});

export const stubTwitterCallback = koaPassport.authenticate('local', {
  failureRedirect: '/local/log-in-form',
});

// auth0 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const signUpAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const logInAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const stubSignUpAuth0 = koaPassport.authenticate('local', {
  failureRedirect: '/local/log-in-form',
});

export const stubLogInAuth0 = koaPassport.authenticate('local', {
  failureRedirect: '/local/log-in-form',
});

export const completeAuthenticationJourney = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware => async (context, next) => {
  pipe(
    getLoggedInScietyUser(adapters, context),
    O.match(
      () => '/create-account-form',
      () => '/',
    ),
    (page) => context.redirect(page),
  );
  await next();
};
