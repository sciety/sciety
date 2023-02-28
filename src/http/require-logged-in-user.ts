import * as O from 'fp-ts/Option';
import { Middleware, ParameterizedContext } from 'koa';
import { pipe } from 'fp-ts/function';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';

type State = {
  targetFragmentId?: string,
};

export const constructRedirectUrl = (context: ParameterizedContext<State>): string => {
  const result = context.request.headers.referer ?? '/';
  if (context.state.targetFragmentId) {
    return `${result}#${context.state.targetFragmentId}`;
  }
  return result;
};

export const requireLoggedInUser = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware<State> => async (context, next) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.match(
      async () => {
        context.session.successRedirect = constructRedirectUrl(context);
        context.redirect('/log-in');
      },
      async () => { await next(); },
    ),
  );
};
