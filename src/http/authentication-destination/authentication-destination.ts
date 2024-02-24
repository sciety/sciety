import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import { calculateAuthenticationDestination } from './calculate-authentication-destination';
import { Logger } from '../../infrastructure';

const contextCodec = t.type({
  session: t.type({
    authenticationDestination: t.string,
  }),
});

const getAuthenticationDestination = (context: ParameterizedContext) => pipe(
  context,
  contextCodec.decode,
  E.map((ctx) => ctx.session.authenticationDestination),
);

export const saveAuthenticationDestination = (
  logger: Logger,
  applicationHostname: string,
): Middleware => async (context: ParameterizedContext, next) => {
  if (context.session === null) {
    throw new Error('Session not found in context');
  }
  context.session.authenticationDestination = calculateAuthenticationDestination(
    logger,
    context.request.headers.referer,
    applicationHostname,
  );
  await next();
};

export const redirectToAuthenticationDestination = (context: ParameterizedContext): void => {
  const target = pipe(
    context,
    getAuthenticationDestination,
    E.getOrElse(() => '/'),
  );
  context.redirect(target);
  if (context.session) {
    delete context.session.authenticationDestination;
  }
};
