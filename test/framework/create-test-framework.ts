import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers';
import { createHappyPathThirdPartyAdapters, HappyPathThirdPartyAdapters } from './happy-path-third-party-adapters';
import { AbortTest, abortTest } from './abort-test';

export type TestFramework = ReadAndWriteSides & {
  abortTest: AbortTest,
  commandHelpers: CommandHelpers,
  happyPathThirdParties: HappyPathThirdPartyAdapters,
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  return {
    ...framework,
    abortTest,
    commandHelpers: createCommandHelpers(framework.commandHandlers),
    happyPathThirdParties: createHappyPathThirdPartyAdapters(),
  };
};
