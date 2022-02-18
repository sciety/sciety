import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import * as T from 'fp-ts/Task';
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
    T.chain(constructListsReadModel),
    T.map(RM.lookup(S.Eq)(params.groupId)),
    T.map(O.fold(
      () => [],
      (list) => [list],
    )),
  )();
  response.body = { items };

  await next();
};
