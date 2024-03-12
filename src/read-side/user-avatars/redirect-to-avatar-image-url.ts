import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { Middleware } from '@koa/router';
import { pipe } from 'fp-ts/function';
import { toRedirectTarget } from '../../html-pages/redirect-target';
import { sendRedirect } from '../../http/send-redirect';
import { Queries } from '../../read-models';
import { candidateUserHandleCodec } from '../../types/candidate-user-handle';

const paramsCodec = t.type({
  handle: candidateUserHandleCodec,
});

export const redirectToAvatarImageUrl = (queries: Queries): Middleware => async (context, next) => {
  const avatarUrl = pipe(
    context.params,
    paramsCodec.decode,
    E.map((params) => params.handle),
    E.map(queries.lookupUserByHandle),
    () => '/static/images/profile-dark.svg',
    toRedirectTarget,
  );
  sendRedirect(context, avatarUrl);
  await next();
};
