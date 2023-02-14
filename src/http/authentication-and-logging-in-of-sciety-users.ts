import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { LookupUser } from '../shared-ports';
import { userIdCodec, UserId } from '../types/user-id';
import { UserDetails } from '../types/user-details';

const passportUserCodec = t.type({
  state: t.type({
    user: t.type({
      id: userIdCodec,
    }),
  }),
});

export const authenticateWithUserId = (
  done: (error: unknown, user?: Record<string, unknown>) => void,
) => (userId: E.Either<unknown, UserId>) => {
  pipe(
    userId,
    E.match(
      (error) => done(error),
      (id) => done(undefined, { id }),
    ),
  );
};

export type Ports = {
  lookupUser: LookupUser,
};

export const getAuthenticatedUserIdFromContext = (
  context: ParameterizedContext,
): O.Option<UserId> => pipe(
  context,
  passportUserCodec.decode,
  O.fromEither,
  O.map((contextWithPassportUser) => contextWithPassportUser.state.user.id),
);

export const getLoggedInScietyUser = (adapters: Ports, context: ParameterizedContext): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext,
  O.chain((id) => adapters.lookupUser(id)),
);
