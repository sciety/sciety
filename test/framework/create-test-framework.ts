import { CommandHelpers, createCommandHelpers } from './create-command-helpers';
import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { createHappyPathThirdPartyAdapters, HappyPathThirdPartyAdapters } from './happy-path-third-party-adapters';
import { Logger } from '../../src/logger';
import { Queries } from '../../src/read-models';
import { Dependencies as DependenciesForExecuteResourceAction } from '../../src/write-side/resources/execute-resource-action';
import { AbortTest, abortTest } from '../abort-test';
import { dummyLogger } from '../dummy-logger';

export type TestFramework = ReadAndWriteSides & {
  abortTest: AbortTest,
  commandHelpers: CommandHelpers,
  happyPathThirdParties: HappyPathThirdPartyAdapters,
  dependenciesForViews: Queries & HappyPathThirdPartyAdapters & { logger: Logger },
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  const happyPathThirdParties = createHappyPathThirdPartyAdapters();
  const dependenciesForExecuteResourceAction: DependenciesForExecuteResourceAction = {
    getAllEvents: framework.getAllEvents,
    commitEvents: framework.commitEvents,
    logger: dummyLogger,
  };
  return {
    ...framework,
    abortTest,
    commandHelpers: createCommandHelpers(dependenciesForExecuteResourceAction),
    happyPathThirdParties,
    dependenciesForViews: {
      ...framework.queries,
      ...happyPathThirdParties,
      logger: dummyLogger,
    },
  };
};
