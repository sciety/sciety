import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as GroupId from '../../types/group-id';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { followCommandHandler } from '../../write-side/command-handlers';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export const groupProperty = 'groupid';

type Dependencies = DependenciesForCommands & SendErrorHtmlResponseDependencies & {
  logger: Logger,
  getGroup: Queries['getGroup'],
};

const validate = (dependencies: Dependencies) => (groupId: GroupId.GroupId) => pipe(
  dependencies.getGroup(groupId),
  E.fromOption(() => DE.notFound),
  E.map((group) => ({
    groupId: group.id,
  })),
);

const requestCodec = t.type({
  body: t.type({
    [groupProperty]: GroupIdFromStringCodec,
  }),
});

export const followHandler = (dependencies: Dependencies): Middleware => async (context, next) => {
  await pipe(
    context.request,
    requestCodec.decode,
    E.map((request) => request.body[groupProperty]),
    TE.fromEither,
    TE.chainEitherKW(validate(dependencies)),
    TE.fold(
      () => {
        dependencies.logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });
        sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong; we\'re looking into it.');
        return T.of(undefined);
      },
      (params) => pipe(
        getAuthenticatedUserIdFromContext(context),
        O.match(
          () => {
            context.redirect('/log-in');
            return T.of(undefined);
          },
          (userId) => {
            context.redirect('back');
            return pipe(
              followCommandHandler(dependencies)({ userId, groupId: params.groupId }),
              T.chain(() => next),
            );
          },
        ),
      ),
    ),
  )();
};
