import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { renderErrorPage } from './render-error-page';
import { constructRedirectUrl } from './require-authentication';
import { sessionGroupProperty } from '../follow/finish-follow-command';
import { CommitEvents, followCommand, GetFollowList } from '../follow/follow-command';
import { groupProperty } from '../follow/follow-handler';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import * as GroupId from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

type ToExistingGroup = (groupId: GroupId.GroupId) => TE.TaskEither<DE.DataError, Group>;

type Ports = {
  logger: Logger,
  getGroup: ToExistingGroup,
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

type Params = {
  [groupProperty]: string | null | undefined,
};

const validate = (toExistingGroup: ToExistingGroup) => (requestBody: Params) => pipe(
  requestBody[groupProperty],
  GroupId.fromNullable,
  TE.fromOption(() => DE.notFound),
  TE.chain(toExistingGroup),
  TE.map((group) => ({
    groupId: group.id,
  })),
);

export const executeIfAuthenticated = ({
  getGroup: toExistingGroup,
  commitEvents,
  getFollowList,
  logger,
}: Ports): Middleware => async (context, next) => {
  await pipe(
    validate(toExistingGroup)(context.request.body),
    TE.fold(
      () => {
        logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });

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
          followCommand(getFollowList, commitEvents)(user, params.groupId),
          T.chain(() => next),
        );
      },
    ),
  )();
};
