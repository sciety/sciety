import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import * as PR from 'io-ts/PathReporter';
import { Logger } from '../shared-ports/logger';
import { ErrorMessage } from '../types/error-message';
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
) => (outcome: E.Either<ErrorMessage, UserId>) => {
  pipe(
    outcome,
    E.match(
      (error) => done(error),
      (userId) => done(undefined, { id: userId }),
    ),
  );
};

export type Ports = GetAuthenticatedUserIdFromContextPorts & {
  getUser: GetUser,
};

export type GetAuthenticatedUserIdFromContextPorts = {
  logger: Logger,
};

export const getAuthenticatedUserIdFromContext = (
  adapters: GetAuthenticatedUserIdFromContextPorts,
) => (
  context: ParameterizedContext,
): O.Option<UserId> => pipe(
  context,
  passportUserCodec.decode,
  E.mapLeft((errors) => {
    adapters.logger('error', 'passport user not found on session state', { errors: PR.failure(errors).join('\n'), context });
    return undefined;
  }),
  O.fromEither,
  O.map((contextWithPassportUser) => contextWithPassportUser.state.user.id),
);

export const getLoggedInScietyUser = (adapters: Ports, context: ParameterizedContext): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext(adapters),
  O.chain((id) => adapters.getUser(id)),
);
