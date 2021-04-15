import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import {
  DefaultContext, DefaultState, Middleware, ParameterizedContext,
} from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { groupProperty } from './follow-handler';
import * as GroupId from '../types/group-id';

type Context = ParameterizedContext<DefaultState, DefaultContext>;

// TODO: this side-effect could be captured differently
const saveCommandAndGroupIdToSession = (context: Context) => (groupId: GroupId.GroupId): void => {
  context.session.command = 'follow';
  context.session[sessionGroupProperty] = groupId.toString();
};

export const saveFollowCommand: Middleware = async (context, next) => {
  pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      saveCommandAndGroupIdToSession(context),
    ),
  );

  await next();
};
