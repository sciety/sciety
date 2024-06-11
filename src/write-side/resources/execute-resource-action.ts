import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ResourceAction } from './resource-action';
import { Logger } from '../../logger';
import { CommandHandler, GenericCommand } from '../../types/command-handler';
import { DependenciesForCommands } from '../dependencies-for-commands';

export type Dependencies = DependenciesForCommands & { logger: Logger };

export const executeResourceAction = <C extends GenericCommand>(
  dependencies: Dependencies,
  resourceAction: ResourceAction<C>,
): CommandHandler<C> => (command: C) => pipe(
    dependencies.getAllEvents,
    T.map(resourceAction(command)),
    TE.chainW(dependencies.commitEvents),
    TE.mapLeft((errors) => {
      dependencies.logger('error', 'Command execution failed', { command });
      return errors;
    }),
  );
