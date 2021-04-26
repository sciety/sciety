import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { renderErrorPage } from './render-error-page';
import { constructRedirectUrl } from './require-authentication';
import { sessionGroupProperty } from '../follow/finish-follow-command';
import { CommitEvents, followCommand, GetFollowList } from '../follow/follow-command';
import { groupProperty } from '../follow/follow-handler';
import { applyStandardPageLayout } from '../shared-components';
import { Group } from '../types/group';
import * as GroupId from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

type ToExistingGroup = (groupId: GroupId.GroupId) => TO.TaskOption<Group>;

type Ports = {
  logger: Logger,
  getGroup: ToExistingGroup,
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const executeIfAuthenticated = ({
  getGroup: toExistingGroup,
  commitEvents,
  getFollowList,
  logger,
}: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    TO.fromOption,
    TO.chain(toExistingGroup),
    TO.fold(
      () => {
        logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });

        context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
        context.response.body = applyStandardPageLayout(O.none)({
          title: 'Error',
          content: renderErrorPage(toHtmlFragment('Something went wrong; we\'re looking into it.')),
        });
        return T.of(undefined);
      },
      (group) => {
        if (!(context.state.user)) {
          context.session.command = 'follow';
          context.session[sessionGroupProperty] = group.id.toString();
          context.session.successRedirect = constructRedirectUrl(context);
          context.redirect('/log-in');
          return T.of(undefined);
        }
        const { user } = context.state;
        context.redirect('back');
        return pipe(
          followCommand(getFollowList, commitEvents)(user, group.id),
          T.chain(() => next),
        );
      },
    ),
  )();
};
