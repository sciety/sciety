import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { userHandleCodec } from '../../types/user-handle';
import { userGeneratedInputCodec } from '../../types/codecs/user-generated-input-codec';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';

// eslint-disable-next-line @typescript-eslint/ban-types
type Ports = {};

const createUserAccountFormCodec = t.type({
  displayName: userGeneratedInputCodec(30),
  handle: userHandleCodec,
});

const signUpAttemptCodec = t.type({
  id: UserIdFromString,
  avatarUrl: t.string,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUserAccount = (adapters: Ports): Middleware => async (context) => pipe(
  context.request.body,
  createUserAccountFormCodec.decode,
  E.chain((formUserDetails) => pipe(
    context.state.user.signUpAttempt,
    signUpAttemptCodec.decode,
    E.map((signUpAttempt) => ({ ...formUserDetails, ...signUpAttempt })),
  )),
);
