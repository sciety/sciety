import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides.js';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers.js';
import { createHappyPathThirdPartyAdapters, HappyPathThirdPartyAdapters } from './happy-path-third-party-adapters.js';
import { AbortTest, abortTest } from './abort-test.js';
import { Logger } from '../../src/infrastructure/index.js';
import { Queries } from '../../src/read-models/index.js';
import { dummyLogger } from '../dummy-logger.js';

export type TestFramework = ReadAndWriteSides & {
  abortTest: AbortTest,
  commandHelpers: CommandHelpers,
  happyPathThirdParties: HappyPathThirdPartyAdapters,
  dependenciesForViews: Queries & HappyPathThirdPartyAdapters & { logger: Logger },
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  const happyPathThirdParties = createHappyPathThirdPartyAdapters();
  return {
    ...framework,
    abortTest,
    commandHelpers: createCommandHelpers(framework.commandHandlers),
    happyPathThirdParties,
    dependenciesForViews: {
      ...framework.queries,
      ...happyPathThirdParties,
      logger: dummyLogger,
    },
  };
};
