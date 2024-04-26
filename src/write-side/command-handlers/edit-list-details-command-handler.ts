import { createCommandHandler } from './create-command-handler';
import { CommandHandler } from '../../types/command-handler';
import { EditListDetailsCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import * as listResource from '../resources/list';

type EditListDetailsCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<EditListDetailsCommand>;

export const editListDetailsCommandHandler: EditListDetailsCommandHandler = (
  dependencies,
) => createCommandHandler(dependencies, listResource.update);
