import * as O from 'fp-ts/Option';
import { Middleware } from 'koa';
import { pipe } from 'fp-ts/function';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users.js';

export const requireLoggedInUser = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware => async (context, next) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.match(
      async () => { context.redirect('/log-in'); },
      async () => { await next(); },
    ),
  );
};
