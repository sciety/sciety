import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../commands/edit-list-details';
import { EditListDetails, GetList, Logger } from '../../shared-ports';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

type CheckUserOwnsListPorts = {
  getList: GetList,
};

type Ports = CheckUserOwnsListPorts & {
  editListDetails: EditListDetails,
  logger: Logger,
};

const checkUserOwnsList = (adapters: CheckUserOwnsListPorts, listId: ListId, userId: UserId) => pipe(
  listId,
  adapters.getList,
  TE.fromOption(() => ({
    message: 'List id not found',
    payload: { listId, userId },
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
);

const authorizeAndHandleCommand = (adapters: Ports, userId: UserId) => (command: EditListDetailsCommand) => pipe(
  checkUserOwnsList(adapters, command.listId, userId),
  TE.chainW(() => pipe(
    command,
    adapters.editListDetails,
    TE.mapLeft((errorMessage) => ({
      message: 'Command handler failed',
      payload: {
        errorMessage,
      },
    })),
  )),
);

type CommandCodec<C> = t.Decoder<unknown, C>;

const validateCommandShape = <C>(codec: CommandCodec<C>) => flow(
  codec.decode,
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
);

export const editListDetails = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    validateCommandShape(editListDetailsCommandCodec),
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
