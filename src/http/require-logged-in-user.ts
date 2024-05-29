import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { getLoggedInScietyUser, Dependencies as GetLoggedInScietyUserDependencies } from './authentication-and-logging-in-of-sciety-users';

/**
 * @deprecated replace with pageHandlerWithLoggedInUser for GET requests & change handler type to ConstructLoggedInPage.
 * As a mikado step, the codec of the page needs to be hidden inside the page
 */
export const requireLoggedInUser = (
  dependencies: GetLoggedInScietyUserDependencies,
): Middleware => async (context, next) => {
  await pipe(
    getLoggedInScietyUser(dependencies, context),
    O.match(
      async () => { context.redirect('/log-in'); },
      async () => { await next(); },
    ),
  );
};
