import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../commands/edit-list-details';
import { EditListDetails, GetList, Logger } from '../../shared-ports';
import * as LOID from '../../types/list-owner-id';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

type Ports = {
  editListDetails: EditListDetails,
  logger: Logger,
  getList: GetList,
};

const authorizeAndHandleCommand = (adapters: Ports, userId: UserId) => (command: EditListDetailsCommand) => pipe(
  command.listId,
  adapters.getList,
  TE.fromOption(() => ({
    message: 'List id not found',
    payload: { listId: command.listId, userId },
  })),
  TE.filterOrElseW(
    (list) => LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId)),
    (list) => ({
      message: 'List owner id does not match user id',
      payload: {
        listId: list.listId,
        listOwnerId: list.ownerId,
        userId,
      },
    }),
  ),
  TE.chainW(flow(
    adapters.editListDetails,
    TE.mapLeft((errorMessage) => ({
      message: 'Command handler failed',
      payload: {
        errorMessage,
      },
    })),
  )),
);

export const editListDetails = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    editListDetailsCommandCodec.decode,
    E.mapLeft(
      (errors) => pipe(
        errors,
        PR.failure,
        (fails) => ({
          message: 'Submitted form can not be decoded into a command',
          payload: { fails },
        }),
      ),
    ),
    TE.fromEither,
    TE.chainW(authorizeAndHandleCommand(adapters, user.id)),
    TE.mapLeft((error) => {
      adapters.logger('error', error.message, error.payload);
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
