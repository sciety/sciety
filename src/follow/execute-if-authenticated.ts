import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { followCommand, Ports as FollowCommandPorts } from './follow-command';
import { groupProperty } from './follow-handler';
import { renderErrorPage } from '../http/render-error-page';
import { constructRedirectUrl } from '../http/require-authentication';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { GetGroup, Logger } from '../shared-ports';
import * as DE from '../types/data-error';
import * as GroupId from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';

type Ports = FollowCommandPorts & {
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

export const executeIfAuthenticated = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    TE.fromOption(() => DE.notFound),
    TE.chainEitherK(validate(ports)),
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
      (params) => {
        if (!(context.state.user)) {
          context.session.command = 'follow';
          context.session[sessionGroupProperty] = params.groupId.toString();
          context.session.successRedirect = constructRedirectUrl(context);
          context.redirect('/log-in');
          return T.of(undefined);
        }
        const { user } = context.state;
        context.redirect('back');
        return pipe(
          followCommand(ports)(user, params.groupId),
          T.chain(() => next),
        );
      },
    ),
  )();
};
