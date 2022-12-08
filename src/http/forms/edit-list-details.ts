import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { checkUserOwnsList, CheckUserOwnsListPorts } from './check-user-owns-list';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../commands/edit-list-details';
import { EditListDetails, Logger } from '../../shared-ports';
import { User } from '../../types/user';

type Ports = CheckUserOwnsListPorts & {
  editListDetails: EditListDetails,
  logger: Logger,
};

const handleCommand = (adapters: Ports) => (command: EditListDetailsCommand) => pipe(
  command,
  adapters.editListDetails,
  TE.mapLeft((errorMessage) => ({
    message: 'Command handler failed',
    payload: {
      errorMessage,
    },
  })),
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

export const editListDetails = (adapters: Ports): Middleware => async (context) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    validateCommandShape(editListDetailsCommandCodec),
    TE.fromEither,
    TE.chainFirstW((command) => checkUserOwnsList(adapters, command.listId, user.id)),
    TE.chainFirstW(handleCommand(adapters)),
    TE.match(
      (error) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect('/action-failed');
      },
      ({ listId }) => {
        context.redirect(`/lists/${listId}`);
      },
    ),
  )();
};
