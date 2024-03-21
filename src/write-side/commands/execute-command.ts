import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { GenericCommand } from '../../types/command-handler';
import { ResourceAction } from '../resources/resource-action';
import { validateInputShape } from './validate-input-shape';
import { ErrorMessage } from '../../types/error-message';
import { CommandResult } from '../../types/command-result';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { Logger } from '../../infrastructure-contract';

export const executeCommand = <C extends GenericCommand>(
  dependencies: DependenciesForCommands & { logger: Logger },
  codec: t.Decoder<unknown, C>,
  resourceAction: ResourceAction<C>,
) => (input: unknown): TE.TaskEither<ErrorMessage, CommandResult> => pipe(
    input,
    validateInputShape(codec),
    TE.fromEither,
    TE.chain((command) => pipe(
      dependencies.getAllEvents,
      TE.rightTask,
      TE.chainEitherKW(resourceAction(command)),
      TE.chainW(dependencies.commitEvents),
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
