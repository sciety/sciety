/* eslint-disable padded-blocks */
import { URL } from 'url';
import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import {
  logInAuth0,
  signUpAuth0,
  completeAuthenticationJourney,
  stubLogInAuth0, stubSignUpAuth0, logOutAuth0, stubLogOutAuth0, Config as LoginMiddlewaresConfig,
} from './login-middlewares';
import { catchErrors } from '../catch-errors';
import { createUserAccount } from '../form-submission-handlers/create-user-account/create-user-account';
import { pageHandler } from '../page-handler';
import { CollectedPorts } from '../../infrastructure';
import { saveAuthenticationDestination } from '../authentication-destination';
import { createUserAccountFormPageLayout, emptyCreateUserAccountFormPage } from '../../html-pages/create-user-account-form-page';

export type Config = LoginMiddlewaresConfig;

const signUpRoute = '/sign-up';
const logInRoute = '/log-in';
const logOutRoute = '/log-out';

const retrieveApplicationHostname = (config: Config) => pipe(
  config.APP_ORIGIN,
  (url) => new URL(url),
  (url) => url.hostname,
);

const configureAuth0Routes = (
  router: Router,
  adapters: CollectedPorts,
  shouldUseStubAdapters: boolean,
  config: Config,
) => {
  router.get(
    '/create-account-form',
    pageHandler(
      adapters,
      emptyCreateUserAccountFormPage,
      createUserAccountFormPageLayout,
    ),
  );

  router.post(
    '/forms/create-user-account',
    bodyParser({ enableTypes: ['form'] }),
    createUserAccount(adapters),
  );

  router.get(
    signUpRoute,
    saveAuthenticationDestination(adapters.logger, retrieveApplicationHostname(config)),
    shouldUseStubAdapters ? stubSignUpAuth0 : signUpAuth0,
  );

  router.get(
    logInRoute,
    saveAuthenticationDestination(adapters.logger, retrieveApplicationHostname(config)),
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
  );

  router.get(
    '/auth0/callback',
    catchErrors(
      adapters,
      'Detected Auth0 callback error',
      'Something went wrong, please try again.',
    ),
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
    completeAuthenticationJourney(adapters),
  );

  router.get(logOutRoute, shouldUseStubAdapters ? stubLogOutAuth0 : logOutAuth0(config));

  if (shouldUseStubAdapters) {
    router.get(
      '/local/log-in-form',
      async (context: ParameterizedContext) => {
        context.response.body = `
            <h1>Local auth</h1>
            <form action="/local/submit-user-id" method="post">
              <label for="userId">User id</label>
              <input type="text" id="userId" name="userId">
              <button>Log in as test user</button>
            </form>
          `;
      },
    );

    const submitUserIdRequestCodec = t.type({
      body: t.type({
        userId: t.string,
      }),
    });

    router.post(
      '/local/submit-user-id',
      bodyParser({ enableTypes: ['form'] }),
      async (context: ParameterizedContext) => {
        const userId = pipe(
          context.request,
          submitUserIdRequestCodec.decode,
          E.getOrElseW(() => { throw new Error('/local/submit-user-id received bad request'); }),
          (req) => req.body.userId,
        );

        context.redirect(`/auth0/callback?username=${userId}&password=anypassword`);
      },
    );
  }
};

export const configureRoutes = (router: Router, adapters: CollectedPorts, config: Config): void => {
  const shouldUseStubAdapters = process.env.USE_STUB_LOGIN === 'true';

  configureAuth0Routes(router, adapters, shouldUseStubAdapters, config);
};
