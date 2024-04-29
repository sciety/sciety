import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Payload } from '../../infrastructure/logger';
import { ActionFailedErrorType } from '../../read-side/html-pages/action-failed/action-failed-page';

type CommandCodec<C> = t.Decoder<unknown, C>;

type CommandValidationFailure = {
  errorType: ActionFailedErrorType,
  message: string,
  payload: Payload,
};

type ValidateCommandShape = <C>(codec: CommandCodec<C>) => (input: unknown) => E.Either<CommandValidationFailure, C>;

export const validateCommandShape: ValidateCommandShape = (codec) => (input) => pipe(
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
