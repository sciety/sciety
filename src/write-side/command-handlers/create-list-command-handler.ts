import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { CreateListCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import * as listResource from '../resources/list';

type CreateListCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<CreateListCommand>;

/**
 * @deprecated should be substituted with executeResourceAction
 */
export const createListCommandHandler: CreateListCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(listResource.create(command)),
  TE.chainW(dependencies.commitEvents),
);
