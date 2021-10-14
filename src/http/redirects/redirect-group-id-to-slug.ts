import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';

type Ports = {
  getGroup: (groupId: GroupId) => TE.TaskEither<DE.DataError, { slug: string }>,
};

export const redirectGroupIdToSlug = (ports: Ports, path: string): Middleware => async (context, next) => {
  await pipe(
    ports.getGroup(context.params.id as GroupId),
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
