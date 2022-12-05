import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { editListDetailsCommandCodec } from '../../commands/edit-list-details';
import { EditListDetails, GetList, Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as LOID from '../../types/list-owner-id';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

type Ports = {
  editListDetails: EditListDetails,
  logger: Logger,
  getList: GetList,
};

type FormBody = {
  name: unknown,
  description: unknown,
  listid: unknown,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleFormSubmission = (adapters: Ports, userId: UserId) => (formBody: FormBody) => pipe(
  {
    name: formBody.name,
    description: formBody.description,
    listId: formBody.listid,
  },
  editListDetailsCommandCodec.decode,
  E.bimap(
    (errors) => pipe(
      errors,
      PR.failure,
      (fails) => adapters.logger('error', 'invalid edit list details form command', { fails }),
    ),
    (command) => {
      adapters.logger('info', 'received edit list details form command', { command });
      return command;
    },
  ),
  TE.fromEither,
  TE.chainW((command) => pipe(
    command.listId,
    adapters.getList,
    TE.fromOption(() => DE.notFound),
    TE.mapLeft((error) => {
      adapters.logger('error', 'List id not found', { listId: command.listId, userId });
      return error;
    }),
    TE.chainEitherK((list) => {
      if (!LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId))) {
        adapters.logger('error', 'List owner id does not match user id', { list, userId });

        return E.left(DE.unavailable);
      }
      adapters.logger('info', 'List owner id matches user id', { list, userId });

      return E.right(command);
    }),
  )),
  TE.chainW(adapters.editListDetails),
);

export const editListDetails = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    handleFormSubmission(adapters, user.id),
    TE.mapLeft(() => {
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
