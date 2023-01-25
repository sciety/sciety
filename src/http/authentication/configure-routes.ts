/* eslint-disable padded-blocks */
import Router from '@koa/router';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import {
  logInAuth0,
  stubLogInTwitter,
  stubTwitterCallback,
  logInTwitter,
  signUpAuth0,
  stubLogInTwitterAsSpecificUser,
  completeAuthenticationJourney,
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

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  type AuthStrategy = 'local' | 'twitter' | 'auth0';

  const authStrategy = process.env.AUTHENTICATION_STRATEGY ?? 'twitter';

  switch (authStrategy as AuthStrategy) {
    case 'local':
      router.get(
        '/sign-up',
        pageHandler(adapters, () => pipe(signUpPage, TE.right)),
      );

      router.get(
        '/log-in',
        saveReferrerToSession,
        stubLogInTwitter,
      );

      router.get('/log-in-as', stubLogInTwitterAsSpecificUser);

      router.get(
        '/sign-up-call-to-action',
        async (context: ParameterizedContext, next) => {
          context.session.successRedirect = '/';
          await next();
        },
        stubLogInTwitter,
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
        onlyIfNotLoggedIn(adapters, stubTwitterCallback),
        finishCommand(adapters),
        finishUnfollowCommand(adapters),
        finishRespondCommand(adapters),
        finishSaveArticleCommand(adapters),
        redirectAfterSuccess(),
      );
      break;
    case 'twitter':
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
      break;
    case 'auth0':
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
        '/sign-up-auth0',
        saveReferrerToSession,
        signUpAuth0,
      );

      router.get(
        '/log-in-auth0',
        saveReferrerToSession,
        logInAuth0,
      );

      router.get(
        '/auth0/callback',
        catchErrors(
          adapters.logger,
          'Detected Auth0 callback error',
          'Something went wrong, please try again.',
        ),
        logInAuth0,
        completeAuthenticationJourney(adapters),
      );
      break;
  }
};
