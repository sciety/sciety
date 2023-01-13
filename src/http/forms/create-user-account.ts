/* eslint-disable @typescript-eslint/no-unused-vars */
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { UserHandle, userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';
import { GetAllEvents } from '../../shared-ports';
import { UserId } from '../../types/user-id';

type Ports = {
  getAllEvents: GetAllEvents,
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
export const checkCommand = (adapters: Ports) => (command: CreateUserAccountCommand) => E.left('');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUserAccount = (adapters: Ports): Middleware => async (context) => pipe(
  context.request.body,
  createUserAccountFormCodec.decode,
  E.chain((formUserDetails) => pipe(
    context.state.user.signUpAttempt,
    signUpAttemptCodec.decode,
    E.map((signUpAttempt) => ({ ...formUserDetails, ...signUpAttempt })),
  )),
  E.chainW(checkCommand(adapters)),
);
