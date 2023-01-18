import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
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

export type Ports = {
  getUser: GetUser,
};

export const getAuthenticatedUserId = (input: unknown): O.Option<UserId> => pipe(
  input,
  passportUserCodec.decode,
  O.fromEither,
  O.map((context) => context.state.user.id),
);

export const getLoggedInScietyUser = (adapters: Ports, input: unknown): O.Option<UserDetails> => pipe(
  input,
  getAuthenticatedUserId,
  O.chain((id) => adapters.getUser(id)),
);
