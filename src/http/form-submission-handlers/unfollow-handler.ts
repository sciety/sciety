import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Logger } from '../../shared-ports';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { unfollowCommandHandler } from '../../write-side/command-handlers';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

const formBodyCodec = t.strict({
  editorialcommunityid: GroupIdFromStringCodec,
});

export const unfollowHandler = (dependencies: Dependencies): Middleware => async (context, next) => {
  await pipe(
    context.request.body,
    formBodyCodec.decode,
    O.fromEither,
    O.map((formBody) => formBody.editorialcommunityid),
    O.match(
      () => context.throw(StatusCodes.BAD_REQUEST),
      async (groupId) => pipe(
        getAuthenticatedUserIdFromContext(context),
        O.match(
          () => {
            dependencies.logger('error', 'Logged in user not found', { context });
            context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
          },
          async (userId) => {
            context.redirect('back');
            await pipe(
              {
                userId,
                groupId,
              },
              unfollowCommandHandler(dependencies),
            )();
          },
        ),
      ),
    ),
  );

  await next();
};
