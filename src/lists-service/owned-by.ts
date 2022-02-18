import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetAllEvents } from './get-all-events';
import { constructListsReadModel } from '../shared-read-models/lists/construct-lists-read-model';

type Ports = {
  getAllEvents: GetAllEvents,
};

export const ownedBy = (ports: Ports): Middleware => async ({ params, response }, next) => {
  response.set({ 'Content-Type': 'application/json' });
  response.status = StatusCodes.OK;
  const items = await pipe(
    ports.getAllEvents,
    TE.chainTaskK(constructListsReadModel),
    TE.map(RM.lookup(S.Eq)(params.groupId)),
    TE.map(O.fold(
      () => [],
      (list) => [list],
    )),
  )();
  response.body = { items };

  await next();
};
