import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { EditListDetailsCommand, editListDetailsCommandCodec } from '../../write-side/commands/edit-list-details';
import { ActionFailedErrorType } from '../../html-pages/action-failed/action-failed-page';
import { Payload } from '../../infrastructure/logger';
import { EditListDetails, Logger } from '../../shared-ports';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
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

export const editListDetailsHandler = (adapters: Ports): Middleware => async (context) => {
  await pipe(
    {
      userDetails: pipe(
        getLoggedInScietyUser(adapters, context),
        E.fromOption(() => ({
          message: 'No authenticated user',
          payload: { formBody: context.request.body },
          errorType: 'codec-failed' as const,
        })),
      ),
      command: pipe(
        context.request.body,
        validateCommandShape(editListDetailsCommandCodec),
      ),
    },
    sequenceS(E.Apply),
    TE.fromEither,
    TE.chainFirstEitherKW(({ command, userDetails }) => checkUserOwnsList(adapters, command.listId, userDetails.id)),
    TE.chainW(({ command, userDetails }) => pipe(
      command,
      handleCommand(adapters),
      TE.map(() => userDetails),
    )),
    TE.match(
      (error: { errorType?: string, message: string, payload: Payload }) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect(`/action-failed${error.errorType ? `?errorType=${error.errorType}` : ''}`);
      },
      ({ handle }) => {
        context.redirect(`/users/${handle}/lists`);
      },
    ),
  )();
};
