import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DefaultContext, DefaultState, Middleware, ParameterizedContext,
} from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { groupProperty } from './follow-handler';
import { Group } from '../types/group';
import * as GroupId from '../types/group-id';

type Context = ParameterizedContext<DefaultState, DefaultContext>;

type Ports = {
  getGroup: (groupId: GroupId.GroupId) => TO.TaskOption<Group>,
};

// TODO: this side-effect could be captured differently
const saveCommandAndGroupIdToSession = (context: Context) => (group: Group): void => {
  context.session.command = 'follow';
  context.session[sessionGroupProperty] = group.id.toString();
};

export const saveFollowCommand = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    TO.fromOption,
    TO.chain(ports.getGroup),
    TO.fold(
      () => T.of(context.throw(StatusCodes.BAD_REQUEST)),
      flow(
        saveCommandAndGroupIdToSession(context),
        () => next,
      ),
    ),
  )();
};
