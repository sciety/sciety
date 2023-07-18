import { Middleware } from '@koa/router';
import { HttpStatusCode } from 'axios';
import { flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { renderAsAtom } from './render-as-atom';
import { Dependencies, constructViewModel, paramsCodec } from './construct-view-model';

export const listFeed = (dependencies: Dependencies): Middleware => async (context, next) => {
  context.response.type = 'application/atom+xml';
  const result = await pipe(
    {
      ...context.params,
      ...context.query,
    },
    paramsCodec.decode,
    E.mapLeft(() => HttpStatusCode.BadRequest),
    TE.fromEither,
    TE.chain(flow(
      constructViewModel(dependencies),
      TE.mapLeft(() => HttpStatusCode.ServiceUnavailable),
    )),
    TE.map(renderAsAtom),
    TE.match(
      (status) => ({
        status,
        body: '',
      }),
      (body) => ({
        status: HttpStatusCode.Ok,
        body,
      }),
    ),
  )();
  context.response.status = result.status;
  context.response.body = result.body;

  await next();
};
