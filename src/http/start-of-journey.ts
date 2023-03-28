import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import { checkReferer } from './check-referer';

const referringPageCodec = t.type({
  session: t.type({
    startOfJourney: t.string,
  }),
});

const getStartOfJourney = (context: ParameterizedContext) => pipe(
  context,
  referringPageCodec.decode,
  E.map((ctx) => ctx.session.startOfJourney),
);

export const rememberPreviousPageAsStartOfJourney: Middleware = async (context: ParameterizedContext, next) => {
  if (context.session === null) {
    throw new Error('Session not found in context');
  }
  context.session.startOfJourney = checkReferer(context.request.headers.referer, 'sciety.org');
  await next();
};

export const redirectToStartOfJourney = (context: ParameterizedContext) => {
  const target = pipe(
    context,
    getStartOfJourney,
    E.getOrElse(() => '/'),
  );
  context.redirect(target);
  if (context.session) {
    delete context.session.startOfJourney;
  }
};
