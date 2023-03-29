import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import { checkReferer } from './check-referer';

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
  hostname: string,
): Middleware => async (context: ParameterizedContext, next) => {
  if (context.session === null) {
    throw new Error('Session not found in context');
  }
  context.session.authenticationDestination = checkReferer(context.request.headers.referer, hostname);
  await next();
};

export const redirectToAuthenticationDestination = (context: ParameterizedContext) => {
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
