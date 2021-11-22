import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { DomainEvent } from '../../domain-events';
import { getGroup } from '../../shared-read-models/all-groups';
import { GroupId } from '../../types/group-id';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const redirectGroupIdToSlug = (ports: Ports, path: string): Middleware => async (context, next) => {
  await pipe(
    ports.getAllEvents,
    T.map(getGroup(context.params.id as GroupId)),
    TE.match(
      () => {
        context.status = StatusCodes.NOT_FOUND;
      },
      ({ slug }) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/groups/${slug}/${path}`);
      },
    ),
  )();

  await next();
};
