import { Middleware, ParameterizedContext } from 'koa';
import * as O from 'fp-ts/Option';
import koaPassport from 'koa-passport';
import { pipe } from 'fp-ts/function';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

// twitter - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const logInTwitter: Middleware = koaPassport.authenticate('twitter', {
  failureRedirect: '/',
});

export const logOutTwitter: Middleware = async (context, next) => {
  context.logout();
  context.redirect('back');

  await next();
};

// auth0 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const removeLocalBrowserSession = (context: ParameterizedContext) => {
  context.logout();
};

const targetPageAfterLogOut = '/';

export const signUpAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const logInAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: 'openid email profile',
});

export const logOutAuth0: Middleware = async (context, next) => {
  removeLocalBrowserSession(context);
  const domain = process.env.AUTH0_DOMAIN ?? '';
  const clientId = process.env.AUTH0_CLIENT_ID ?? '';
  const app = process.env.APP_ORIGIN ?? '';
  const auth0logout = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${app}${targetPageAfterLogOut}`;
  context.redirect(auth0logout);

  await next();
};

export const stubSignUpAuth0 = koaPassport.authenticate('local', {
  failureRedirect: '/local/log-in-form',
});

export const stubLogInAuth0 = koaPassport.authenticate('local', {
  failureRedirect: '/local/log-in-form',
});

export const stubLogOutAuth0: Middleware = async (context, next) => {
  removeLocalBrowserSession(context);
  context.redirect(targetPageAfterLogOut);

  await next();
};

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
