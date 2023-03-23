import * as O from 'fp-ts/Option';
import { Middleware, ParameterizedContext } from 'koa';
import { pipe } from 'fp-ts/function';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';

const constructRedirectUrl = (context: ParameterizedContext): string => (
  context.request.headers.referer ?? '/'
);

export const rememberPreviousPageAsStartOfJourney = (context: ParameterizedContext) => {
  context.session.startOfJourney = constructRedirectUrl(context);
};

export const requireLoggedInUser = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware => async (context, next) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.match(
      async () => {
        rememberPreviousPageAsStartOfJourney(context);
        context.redirect('/log-in');
      },
      async () => { await next(); },
    ),
  );
};
