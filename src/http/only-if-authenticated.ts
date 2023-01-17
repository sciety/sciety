import { Middleware } from 'koa';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './get-logged-in-sciety-user';

export const onlyIfNotAuthenticated = (
  adapters: GetLoggedInScietyUserPorts,
  original: Middleware,
): Middleware => async (context, next) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.match(
      async () => { await original(context, next); },
      async () => { await next(); },
    ),
  );
};
