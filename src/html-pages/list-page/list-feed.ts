import { Middleware } from '@koa/router';
import { HttpStatusCode } from 'axios';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { renderAsAtom } from './render-as-atom';
import { ListId } from '../../types/list-id';
import { Dependencies } from './construct-view-model/dependencies';
import { constructViewModel } from './construct-view-model/construct-view-model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listFeed = (dependencies: Dependencies): Middleware => async (context, next) => {
  context.response.status = HttpStatusCode.Ok;
  context.response.type = 'application/atom+xml';
  context.response.body = await pipe(
    {
      page: 1,
      id: '' as ListId,
      user: O.none,
    },
    constructViewModel(dependencies),
    TE.map(renderAsAtom),
    TE.getOrElse(() => T.of('')),
  )();

  await next();
};
