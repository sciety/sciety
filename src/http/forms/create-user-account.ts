import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { createAccountIfNecessary } from '../../user-account/create-account-if-necessary';
import { userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { DomainEvent, isUserCreatedAccountEvent } from '../../domain-events';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { CreateUserAccountCommand } from '../../write-side/commands';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const createUserAccountFormCodec = t.type({
  displayName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

// ts-unused-exports:disable-next-line
export const checkCommand = (command: CreateUserAccountCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle === command.handle),
  RA.match(
    () => E.right(command),
    () => E.left(''),
  ),
);

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
        userId,
        avatarUrl: '/static/images/profile-dark.svg',
      })),
    )),
    T.of,
    TE.chainW((command) => pipe(
      adapters.getAllEvents,
      T.map(checkCommand(command)),
    )),
    TE.chainFirstTaskK(createAccountIfNecessary(adapters)),
    TE.map(() => context.redirect('/')),
  )();
};
