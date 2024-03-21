import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { followCommandHandler } from '../../write-side/command-handlers';
import { Logger } from '../../infrastructure-contract';
import * as DE from '../../types/data-error';
import * as GroupId from '../../types/group-id';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { Queries } from '../../read-models';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export const groupProperty = 'groupid';

type Ports = GetLoggedInScietyUserPorts & DependenciesForCommands & SendErrorHtmlResponseDependencies & {
  logger: Logger,
  getGroup: Queries['getGroup'],
};

const validate = (dependencies: Ports) => (groupId: GroupId.GroupId) => pipe(
  dependencies.getGroup(groupId),
  E.fromOption(() => DE.notFound),
  E.map((group) => ({
    groupId: group.id,
  })),
);

const requestCodec = t.type({
  body: t.type({
    [groupProperty]: GroupIdFromString,
  }),
});

export const followHandler = (dependencies: Ports): Middleware => async (context, next) => {
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
        getLoggedInScietyUser(dependencies, context),
        O.match(
          () => {
            context.redirect('/log-in');
            return T.of(undefined);
          },
          (userDetails) => {
            context.redirect('back');
            return pipe(
              followCommandHandler(dependencies)({ userId: userDetails.id, groupId: params.groupId }),
              T.chain(() => next),
            );
          },
        ),
      ),
    ),
  )();
};
