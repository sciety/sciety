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
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as GroupId from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { Queries } from '../../read-models';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { renderErrorPage } from '../../html-pages/render-error-page';

export const groupProperty = 'groupid';

type Ports = GetLoggedInScietyUserPorts & DependenciesForCommands & {
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

        context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
        context.response.body = standardPageLayout(O.none)({
          title: 'Error',
          content: renderErrorPage(toHtmlFragment('Something went wrong; we\'re looking into it.')),
        });
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
