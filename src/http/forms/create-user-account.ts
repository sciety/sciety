import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import { createUserAccountCommandHandler } from '../../write-side/create-user-account/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/user-generated-input';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import {
  getAuthenticatedUserIdFromContext, Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser, referringPage,
} from '../authentication-and-logging-in-of-sciety-users';
import { renderFormPage } from '../../html-pages/create-user-account-form-page/create-user-account-form-page';
import { createUserAccountFormPageLayout } from '../../html-pages/create-user-account-form-page/create-user-account-form-page-layout';
import { toWebPage } from '../page-handler';
import { CommandResult } from '../../types/command-result';

// ts-unused-exports:disable-next-line
export const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

type Ports = GetLoggedInScietyUserPorts & {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

const unvalidatedFormDetailsCodec = t.type({
  fullName: t.string,
  handle: t.string,
});

type UnvalidatedFormDetails = t.TypeOf<typeof unvalidatedFormDetailsCodec>;

type ValidateAndExecuteCommand = (context: ParameterizedContext, adapters: Ports)
=> TE.TaskEither<UnvalidatedFormDetails, CommandResult>;

const validateAndExecuteCommand: ValidateAndExecuteCommand = (context, adapters) => pipe(
  {
    formUserDetails: pipe(
      context.request.body,
      createUserAccountFormCodec.decode,
      E.mapLeft(() => 'validation-error'),
    ),
    authenticatedUserId: pipe(
      context,
      getAuthenticatedUserIdFromContext,
      E.fromOption(() => 'no-authenticated-user-id'),
    ),
  },
  sequenceS(E.Apply),
  E.map(({ formUserDetails, authenticatedUserId }) => ({
    ...formUserDetails,
    displayName: formUserDetails.fullName,
    userId: authenticatedUserId,
    avatarUrl: defaultSignUpAvatarUrl,
  })),
  T.of,
  TE.chainW(createUserAccountCommandHandler(adapters)),
  TE.mapLeft(() => pipe(
    context.request.body,
    unvalidatedFormDetailsCodec.decode,
    E.getOrElse(() => ({
      fullName: '',
      handle: '',
    })),
  )),
);

export const createUserAccount = (adapters: Ports): Middleware => async (context, next) => {
  await pipe(
    validateAndExecuteCommand(context, adapters),
    TE.bimap(
      (formDetails) => {
        const page = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage(formDetails.fullName, formDetails.handle),
          E.right,
          toWebPage(getLoggedInScietyUser(adapters, context), createUserAccountFormPageLayout),
        );
        context.response.status = page.status;
        context.response.type = 'html';
        context.response.body = page.body;
      },
      () => context.redirect(referringPage(context)),
    ),
  )();
  await next();
};
