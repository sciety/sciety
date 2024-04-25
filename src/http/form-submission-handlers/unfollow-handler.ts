import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Logger } from '../../shared-ports';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { unfollowCommandHandler } from '../../write-side/command-handlers';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

type Ports = GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const requestCodec = t.type({
  body: t.type({
    editorialcommunityid: GroupIdFromStringCodec,
  }),
});

export const unfollowHandler = (dependencies: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request,
    requestCodec.decode,
    O.fromEither,
    O.map((req) => req.body.editorialcommunityid),
    O.match(
      () => context.throw(StatusCodes.BAD_REQUEST),
      async (groupId) => pipe(
        getLoggedInScietyUser(dependencies, context),
        O.match(
          () => {
            dependencies.logger('error', 'Logged in user not found', { context });
            context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
          },
          async (userDetails) => {
            context.redirect('back');
            await pipe(
              {
                userId: userDetails.id,
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
