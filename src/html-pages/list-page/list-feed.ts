import { Middleware } from '@koa/router';
import { HttpStatusCode } from 'axios';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { renderAsAtom } from './render-as-atom';
import { Dependencies, constructViewModel, paramsCodec } from './construct-view-model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listFeed = (dependencies: Dependencies): Middleware => async (context, next) => {
  context.response.status = HttpStatusCode.Ok;
  context.response.type = 'application/atom+xml';
  context.response.body = await pipe(
    {
      ...context.params,
      ...context.query,
    },
    paramsCodec.decode,
    TE.fromEither,
    TE.chainW(constructViewModel(dependencies)),
    TE.map(renderAsAtom),
    TE.getOrElse(() => T.of('')),
  )();

  await next();
};
