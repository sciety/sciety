/* eslint-disable padded-blocks */
import { URL } from 'url';
import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import {
  logInAuth0,
  signUpAuth0,
  completeAuthenticationJourney,
  stubLogInAuth0, stubSignUpAuth0, logOutAuth0, stubLogOutAuth0, Config as LoginMiddlewaresConfig,
} from './login-middlewares';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { createPageFromParams } from '../../read-side/html-pages/create-page-from-params';
import { paramsCodec as createUserAccountFormPageParamsCodec, createUserAccountFormPageLayout, createUserAccountFormPage } from '../../read-side/html-pages/create-user-account-form-page';
import { DependenciesForCommands } from '../../write-side';
import { saveAuthenticationDestination } from '../authentication-destination';
import { catchErrors } from '../catch-errors';
import { createUserAccount } from '../form-submission-handlers/create-user-account';
import { pageHandler } from '../page-handler';

export type Config = LoginMiddlewaresConfig;

type Dependencies = DependenciesForCommands & DependenciesForViews;

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
  dependencies: Dependencies,
  shouldUseStubAdapters: boolean,
  config: Config,
) => {
  router.get(
    '/create-account-form',
    pageHandler(
      dependencies,
      createPageFromParams(createUserAccountFormPageParamsCodec, createUserAccountFormPage),
      createUserAccountFormPageLayout,
    ),
  );

  router.post(
    '/forms/create-user-account',
    bodyParser({ enableTypes: ['form'] }),
    createUserAccount(dependencies),
  );

  router.get(
    signUpRoute,
    saveAuthenticationDestination(dependencies.logger, retrieveApplicationHostname(config)),
    shouldUseStubAdapters ? stubSignUpAuth0 : signUpAuth0,
  );

  router.get(
    logInRoute,
    saveAuthenticationDestination(dependencies.logger, retrieveApplicationHostname(config)),
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
  );

  router.get(
    '/auth0/callback',
    catchErrors(
      dependencies,
      'Detected Auth0 callback error',
      'Something went wrong, please try again.',
    ),
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
    completeAuthenticationJourney(dependencies),
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

export const configureRoutes = (router: Router, dependencies: Dependencies, config: Config): void => {
  const shouldUseStubAdapters = process.env.USE_STUB_LOGIN === 'true';

  configureAuth0Routes(router, dependencies, shouldUseStubAdapters, config);
};
