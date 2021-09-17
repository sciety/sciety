import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GroupId } from '../../types/group-id';

type Ports = {
  getGroup: (groupId: GroupId) => TO.TaskOption<{ slug: string }>,
};

export const redirectGroupIdToSlug = (ports: Ports, path: string): Middleware => async (context, next) => {
  await pipe(
    ports.getGroup(context.params.id as GroupId),
    T.map(O.fold(
      () => {
        context.status = StatusCodes.NOT_FOUND;
      },
      ({ slug }) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/groups/${slug}/${path}`);
      },
    )),
  )();

  await next();
};
