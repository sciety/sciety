import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { createUserAccountCommandHandler } from '../../write-side/create-user-account/create-user-account-command-handler';
import { userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { getAuthenticatedUserIdFromContext, referringPage } from '../authentication-and-logging-in-of-sciety-users';

// ts-unused-exports:disable-next-line
export const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const createUserAccountFormCodec = t.type({
  fullName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUserAccount = (adapters: Ports): Middleware => async (context) => {
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
      () => context.redirect('/create-account-form?errorSummary=generic'),
      () => context.redirect(referringPage(context)),
    ),
  )();
};
