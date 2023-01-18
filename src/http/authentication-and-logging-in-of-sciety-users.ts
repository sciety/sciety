import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { GetUser } from '../shared-ports';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { UserDetails } from '../types/user-details';
import { UserId } from '../types/user-id';

const passportUserCodec = t.type({
  state: t.type({
    user: t.type({
      id: UserIdFromString,
    }),
  }),
});

export const writeUserIdToState = (
  done: (error: unknown, user?: Record<string, unknown>) => void,
) => (userId: UserId) => {
  const passportUserState = {
    id: userId,
  };
  done(
    undefined,
    passportUserState,
  );
};

export const getAuthenticatedUserIdFromContext = (context: ParameterizedContext): O.Option<UserId> => pipe(
  context,
  passportUserCodec.decode,
  O.fromEither,
  O.map((contextWithPassportUser) => contextWithPassportUser.state.user.id),
);

export type Ports = {
  getUser: GetUser,
};

export const getLoggedInScietyUser = (adapters: Ports, context: ParameterizedContext): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext,
  O.chain((id) => adapters.getUser(id)),
);
