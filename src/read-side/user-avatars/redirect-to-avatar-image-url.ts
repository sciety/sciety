import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { Middleware } from '@koa/router';
import { pipe } from 'fp-ts/function';
import { toRedirectTarget } from '../../html-pages/redirect-target';
import { sendRedirect } from '../../http/send-redirect';
import { Queries } from '../../read-models';
import { candidateUserHandleCodec } from '../../types/candidate-user-handle';
import * as DE from '../../types/data-error';
import { ExternalQueries } from '../../third-parties';

type Dependencies = Queries & ExternalQueries;

const paramsCodec = t.type({
  handle: candidateUserHandleCodec,
});

export const redirectToAvatarImageUrl = (dependencies: Dependencies): Middleware => async (context, next) => {
  const avatarUrl = await pipe(
    context.params,
    paramsCodec.decode,
    E.map((params) => params.handle),
    E.flatMapOption(
      dependencies.lookupUserByHandle,
      () => DE.notFound,
    ),
    TE.fromEither,
    TE.chainW((userDetails) => dependencies.fetchUserAvatarUrl(userDetails.id)),
    TE.getOrElseW(() => T.of('/static/images/profile-dark.svg')),
    T.map(toRedirectTarget),
  )();
  sendRedirect(context, avatarUrl);
  await next();
};
