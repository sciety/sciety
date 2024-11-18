import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { getAuthenticatedUserIdFromContext } from './authentication-and-logging-in-of-sciety-users';

/**
 * @deprecated replace with pageHandlerWithLoggedInUser for GET requests & change handler type to ConstructLoggedInPage.
 * As a mikado step, the codec of the page needs to be hidden inside the page
 */
export const requireLoggedInUser = (): Middleware => async (context, next) => {
  await pipe(
    getAuthenticatedUserIdFromContext(context),
    O.match(
      async () => { context.redirect('/log-in'); },
      async () => { await next(); },
    ),
  );
};
