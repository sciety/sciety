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

const oAuthScope = 'openid email profile';

// https://auth0.com/docs/authenticate/login/auth0-universal-login/new-experience#signup
// https://github.com/auth0/passport-auth0/pull/131
const takeUsersDirectlyToAuth0Signup = 'signup';

const customSignUpParameters = {
  screen_hint: takeUsersDirectlyToAuth0Signup,
};

const removeLocalBrowserSession = (context: ParameterizedContext) => {
  context.logout();
};

const targetPageAfterLogOut = '/';

export const signUpAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: oAuthScope,
  ...customSignUpParameters,
});

export const logInAuth0: Middleware = koaPassport.authenticate('auth0', {
  failureRedirect: '/',
  scope: oAuthScope,
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
