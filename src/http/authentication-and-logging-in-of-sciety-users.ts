import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { ParameterizedContext } from 'koa';
import { Queries } from '../read-models';
import { UserDetails } from '../types/user-details';
import { userIdCodec, UserId } from '../types/user-id';

const passportUserCodec = t.type({
  state: t.type({
    user: t.type({
      id: userIdCodec,
    }),
  }),
});

export const authenticateWithUserId = (
  done: (error: unknown, user?: Record<string, unknown>) => void,
) => (userId: E.Either<unknown, UserId>): ReturnType<typeof done> => {
  pipe(
    userId,
    E.match(
      (error) => done(error),
      (id) => done(undefined, { id }),
    ),
  );
};

export type Dependencies = Pick<Queries, 'lookupUser'>;

export const getAuthenticatedUserIdFromContext = (
  context: ParameterizedContext,
): O.Option<UserId> => pipe(
  context,
  passportUserCodec.decode,
  O.fromEither,
  O.map((contextWithPassportUser) => contextWithPassportUser.state.user.id),
);

/**
 * @deprecated
 *
 * - If only the UserId is necessary, replace with call to getAuthenticatedUserIdFromContext.
 *
 * - If you require UserDetails, inline this pipe.
 * This exposes the query and makes it possible to move it down into the read-side
 * e.g. with a layout view we don't have yet.
 */
export const getLoggedInScietyUser = (
  dependencies: Dependencies,
  context: ParameterizedContext,
): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext,
  O.chain((id) => dependencies.lookupUser(id)),
);
