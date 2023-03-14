import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers';
import { createHappyPathThirdPartyAdapters, HappyPathThirdPartyAdapters } from './happy-path-third-party-adapters';

export type TestFramework = ReadAndWriteSides & {
  commandHelpers: CommandHelpers,
  happyPathThirdParties: HappyPathThirdPartyAdapters,
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  return {
    ...framework,
    commandHelpers: createCommandHelpers(framework.commandHandlers),
    happyPathThirdParties: createHappyPathThirdPartyAdapters(),
  };
};
