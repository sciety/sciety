/* eslint-disable padded-blocks */
import Router from '@koa/router';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import {
  logInAuth0,
  logInTwitter,
  signUpAuth0,
  completeAuthenticationJourney,
  stubLogInAuth0, stubSignUpAuth0,
} from './login-middlewares';
import { catchErrors } from '../catch-errors';
import { finishCommand } from '../finish-command';
import { createUserAccount } from '../forms/create-user-account';
import { logOut } from '../log-out';
import { onlyIfNotLoggedIn } from '../only-if-not-logged-in';
import { pageHandler } from '../page-handler';
import { redirectAfterSuccess } from '../require-logged-in-user';
import { createUserAccountFormPage } from '../../html-pages/create-user-account-form-page/create-user-account-form-page';
import {
  finishUnfollowCommand,
} from '../../write-side/follow';
import { CollectedPorts } from '../../infrastructure';
import { finishRespondCommand } from '../../write-side/respond/finish-respond-command';
import { finishSaveArticleCommand } from '../../write-side/save-article/finish-save-article-command';
import { signUpPage } from '../../html-pages/sign-up-page';

const saveReferrerToSession: Middleware = async (context: ParameterizedContext, next) => {
  if (!context.session.successRedirect) {
    context.session.successRedirect = context.request.headers.referer ?? '/';
  }
  await next();
};

const configureAuth0Routes = (router: Router, adapters: CollectedPorts, shouldUseStubAdapters: boolean) => {
  router.get(
    '/create-account-form',
    pageHandler(adapters, () => pipe(createUserAccountFormPage, TE.right)),
  );

  router.post(
    '/forms/create-user-account',
    bodyParser({ enableTypes: ['form'] }),
    createUserAccount(adapters),
  );

  router.get(
    '/sign-up',
    saveReferrerToSession,
    shouldUseStubAdapters ? stubSignUpAuth0 : signUpAuth0,
  );

  router.get(
    '/log-in',
    saveReferrerToSession,
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
  );

  router.get(
    '/auth0/callback',
    catchErrors(
      adapters.logger,
      'Detected Auth0 callback error',
      'Something went wrong, please try again.',
    ),
    shouldUseStubAdapters ? stubLogInAuth0 : logInAuth0,
    completeAuthenticationJourney(adapters),
  );

  router.get('/log-out', logOut);

  if (shouldUseStubAdapters) {
    router.get(
      '/local/log-in-form',
      async (context: ParameterizedContext) => {
        context.body = `
            <h1>Local auth</h1>
            <form action="/local/submit-user-id" method="post">
              <label for="userId">User id</label>
              <input type="text" id="userId" name="userId">
              <button>Log in</button>
            </form>
          `;
      },
    );

    router.post(
      '/local/submit-user-id',
      bodyParser({ enableTypes: ['form'] }),
      async (context: ParameterizedContext) => {
        context.redirect(`/auth0/callback?username=${context.request.body.userId as string}&password=anypassword`);
      },
    );
  }
};

const configureTwitterRoutes = (router: Router, adapters: CollectedPorts) => {
  router.get(
    '/sign-up',
    pageHandler(adapters, () => pipe(signUpPage, TE.right)),
  );

  router.get(
    '/log-in',
    saveReferrerToSession,
    logInTwitter,
  );

  router.get(
    '/sign-up-call-to-action',
    async (context: ParameterizedContext, next) => {
      context.session.successRedirect = '/';
      await next();
    },
    logInTwitter,
  );

  router.get('/log-out', logOut);

  // TODO set commands as an object on the session rather than individual properties
  router.get(
    '/twitter/callback',
    catchErrors(
      adapters.logger,
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    onlyIfNotLoggedIn(adapters, logInTwitter),
    finishCommand(adapters),
    finishUnfollowCommand(adapters),
    finishRespondCommand(adapters),
    finishSaveArticleCommand(adapters),
    redirectAfterSuccess(),
  );
};

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  const shouldUseAuth0 = process.env.FEATURE_FLAG_AUTH0 === 'true';
  const shouldUseStubAdapters = process.env.USE_STUB_ADAPTERS === 'true';

  if (shouldUseAuth0) {
    configureAuth0Routes(router, adapters, shouldUseStubAdapters);
  } else {
    configureTwitterRoutes(router, adapters);
  }

};
