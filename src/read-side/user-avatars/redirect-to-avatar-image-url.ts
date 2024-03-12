import * as E from 'fp-ts/Either';
import { Middleware } from '@koa/router';
import { pipe } from 'fp-ts/function';
import { toRedirectTarget } from '../../html-pages/redirect-target';
import { sendRedirect } from '../../http/send-redirect';
import { Queries } from '../../read-models';
import { candidateUserHandleCodec } from '../../types/candidate-user-handle';

export const redirectToAvatarImageUrl = (queries: Queries): Middleware => async (context, next) => {
  const avatarUrl = pipe(
    context.params,
    candidateUserHandleCodec.decode,
    E.map(queries.lookupUserByHandle),
    () => '/static/images/profile-dark.svg',
    toRedirectTarget,
  );
  sendRedirect(context, avatarUrl);
  await next();
};
