import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { followCommandHandler, Ports as FollowCommandPorts } from './follow-command-handler';
import { renderErrorPage } from '../../http/render-error-page';
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import { GetGroup, Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as GroupId from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';

export const groupProperty = 'groupid';

type Ports = GetLoggedInScietyUserPorts & FollowCommandPorts & {
  logger: Logger,
  getGroup: GetGroup,
};

const validate = (ports: Ports) => (groupId: GroupId.GroupId) => pipe(
  ports.getGroup(groupId),
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

export const followHandler = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request,
    requestCodec.decode,
    E.map((request) => request.body[groupProperty]),
    TE.fromEither,
    TE.chainEitherKW(validate(ports)),
    TE.fold(
      () => {
        ports.logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });

        context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
        context.response.body = standardPageLayout(O.none)({
          title: 'Error',
          content: renderErrorPage(toHtmlFragment('Something went wrong; we\'re looking into it.')),
        });
        return T.of(undefined);
      },
      (params) => pipe(
        getLoggedInScietyUser(ports, context),
        O.match(
          () => {
            context.redirect('/log-in');
            return T.of(undefined);
          },
          (userDetails) => {
            context.redirect('back');
            return pipe(
              followCommandHandler(ports)({ userId: userDetails.id, groupId: params.groupId }),
              T.chain(() => next),
            );
          },
        ),
      ),
    ),
  )();
};
