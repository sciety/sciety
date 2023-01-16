import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { createAccountIfNecessary } from '../../user-account/create-account-if-necessary';
import { UserHandle, userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { UserId } from '../../types/user-id';
import { DomainEvent, isUserCreatedAccountEvent } from '../../domain-events';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const createUserAccountFormCodec = t.type({
  displayName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

const signUpAttemptCodec = t.type({
  id: UserIdFromString,
  avatarUrl: t.string,
});

type CreateUserAccountCommand = {
  id: UserId,
  handle: UserHandle,
  avatarUrl: string,
  displayName: string,
};

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
    E.chain((formUserDetails) => pipe(
      context.state.user.signUpAttempt,
      signUpAttemptCodec.decode,
      E.map((signUpAttempt) => ({ ...formUserDetails, ...signUpAttempt })),
    )),
    T.of,
    TE.chainW((command) => pipe(
      adapters.getAllEvents,
      T.map(checkCommand(command)),
    )),
    TE.chainTaskK(createAccountIfNecessary(adapters)),
    TE.map(() => context.redirect('/')),
    TE.map(() => {
      context.session.passport.user = {
        id: context.state.user.signUpAttempt.id,
        handle: 'somehandle',
        avatarUrl: context.state.user.signUpAttempt.avatarUrl,
      };
      return undefined;
    }),
  )();
};
