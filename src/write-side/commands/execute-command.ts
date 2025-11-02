import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { validateInputShape } from './validate-input-shape';
import { Logger } from '../../logger';
import { GenericCommand } from '../../types/command-handler';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage } from '../../types/error-message';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { ResourceAction } from '../resources/resource-action';

export const executeCommand = <C extends GenericCommand>(
  dependencies: DependenciesForCommands & { logger: Logger },
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
) => (input: unknown): TE.TaskEither<ErrorMessage, CommandResult> => pipe(
    input,
    validateInputShape(codec),
    TE.fromEither,
    TE.flatMap((command) => pipe(
      dependencies.getAllEvents,
      TE.rightTask,
      TE.chainEitherKW(resourceAction(command)),
      TE.flatMap(dependencies.commitEvents),
    )),
    TE.mapLeft((errorMessage) => {
      dependencies.logger(
        'error',
        'Command execution failed',
        {
          errorMessage,
          commandInput: input,
        },
      );
      return errorMessage;
    }),
  );
