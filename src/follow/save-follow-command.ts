import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DefaultContext, DefaultState, Middleware, ParameterizedContext,
} from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { groupProperty } from './follow-handler';
import { Group } from '../types/group';
import * as GroupId from '../types/group-id';

type Context = ParameterizedContext<DefaultState, DefaultContext>;

// TODO: this side-effect could be captured differently
const saveCommandAndGroupIdToSession = (context: Context) => (group: Group): void => {
  context.session.command = 'follow';
  context.session[sessionGroupProperty] = group.id.toString();
};

const isCurrentGroup = (groupId: GroupId.GroupId) => TO.some({
  id: groupId,
  name: '',
  avatarPath: '',
  descriptionPath: '',
  shortDescription: '',
});

export const saveFollowCommand: Middleware = async (context, next) => {
  await pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    T.of,
    TO.chain(isCurrentGroup),
    TO.fold(
      () => T.of(context.throw(StatusCodes.BAD_REQUEST)),
      (g) => T.of(saveCommandAndGroupIdToSession(context)(g)),
    ),
  )();

  await next();
};
