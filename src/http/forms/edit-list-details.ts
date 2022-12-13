import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Middleware } from 'koa';
import { checkUserOwnsList, CheckUserOwnsListPorts } from './check-user-owns-list';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../commands/edit-list-details';
import { ActionFailedErrorType } from '../../html-pages/action-failed/action-failed-page';
import { Payload } from '../../infrastructure/logger';
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

type CommandValidationFailure = {
  errorType: ActionFailedErrorType,
  message: string,
  payload: Payload,
};

type ValidateCommandShape = <C>(codec: CommandCodec<C>) => (input: unknown) => E.Either<CommandValidationFailure, C>;

const validateCommandShape: ValidateCommandShape = (codec) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft(
    (errors) => pipe(
      errors,
      formatValidationErrors,
      (fails) => ({
        errorType: 'codec-failed' as const,
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
      (error: { errorType?: string, message: string, payload: Payload }) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect(`/action-failed${error.errorType ? `?errorType=${error.errorType}` : ''}`);
      },
      ({ listId }) => {
        context.redirect(`/lists/${listId}`);
      },
    ),
  )();
};
