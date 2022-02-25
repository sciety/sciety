import * as O from 'fp-ts/Option';
import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { List } from '../shared-read-models/lists';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

export type Ports = {
  listsReadModel: TE.TaskEither<Error, ListsReadModel>,
};

export const ownedBy = (ports: Ports): Middleware => async ({ params, response }, next) => {
  response.set({ 'Content-Type': 'application/json' });
  await pipe(
    ports.listsReadModel,
    TE.map(RM.lookup(S.Eq)(params.groupId)),
    TE.map(O.fold(
      () => [],
      (list) => [list],
    )),
    TE.match(
      () => {
        response.status = StatusCodes.SERVICE_UNAVAILABLE;
      },
      (items) => {
        response.status = StatusCodes.OK;
        response.body = { items };
      },
    ),
  )();

  await next();
};
