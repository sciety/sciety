import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { createUserAccountCommandHandler } from '../../write-side/create-user-account/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import {
  getAuthenticatedUserIdFromContext, Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser, referringPage,
} from '../authentication-and-logging-in-of-sciety-users';
import { renderFormPage } from '../../html-pages/create-user-account-form-page/create-user-account-form-page';
import { createUserAccountFormPageLayout } from '../../html-pages/create-user-account-form-page/create-user-account-form-page-layout';
import { toWebPage } from '../page-handler';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUserAccount = (adapters: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request.body,
    createUserAccountFormCodec.decode,
    E.chainW((formUserDetails) => pipe(
      context,
      getAuthenticatedUserIdFromContext,
      E.fromOption(() => 'no-authenticated-user-id'),
      E.map((userId) => ({
        ...formUserDetails,
        displayName: formUserDetails.fullName,
        userId,
        avatarUrl: defaultSignUpAvatarUrl,
      })),
    )),
    T.of,
    TE.chainW(createUserAccountCommandHandler(adapters)),
    TE.bimap(
      () => {
        const page = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage,
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
