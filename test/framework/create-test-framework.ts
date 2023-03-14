import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers';

export type TestFramework = ReadAndWriteSides & {
  commandHelpers: CommandHelpers,
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  return {
    ...framework,
    commandHelpers: createCommandHelpers(framework.commandHandlers),
  };
};
