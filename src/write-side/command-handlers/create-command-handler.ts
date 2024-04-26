import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler, GenericCommand } from '../../types/command-handler';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { ResourceAction } from '../resources/resource-action';

export const createCommandHandler = <C extends GenericCommand>(
  dependencies: DependenciesForCommands,
  resourceAction: ResourceAction<C>,
): CommandHandler<C> => (command: C) => pipe(
    dependencies.getAllEvents,
    T.map(resourceAction(command)),
    TE.chainW(dependencies.commitEvents),
  );
