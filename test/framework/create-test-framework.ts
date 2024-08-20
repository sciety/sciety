import * as TE from 'fp-ts/TaskEither';
import { CommandHelpers, createCommandHelpers } from './create-command-helpers';
import { createReadAndWriteSides, ReadAndWriteSides } from './create-read-and-write-sides';
import { createHappyPathExternalQueries } from './happy-path-external-queries';
import { DependenciesForViews } from '../../src/read-side/dependencies-for-views';
import { DependenciesForSagas } from '../../src/sagas/dependencies-for-sagas';
import { DependenciesForCommands } from '../../src/write-side';
import { Dependencies as DependenciesForExecuteResourceAction } from '../../src/write-side/resources/execute-resource-action';
import { AbortTest, abortTest } from '../abort-test';
import { dummyLogger } from '../dummy-logger';

export type TestFramework = ReadAndWriteSides & {
  abortTest: AbortTest,
  commandHelpers: CommandHelpers,
  dependenciesForViews: DependenciesForViews,
  dependenciesForCommands: DependenciesForCommands,
  dependenciesForSagas: DependenciesForSagas,
};

export const createTestFramework = (): TestFramework => {
  const framework = createReadAndWriteSides();
  const happyPathExternalQueries = createHappyPathExternalQueries();
  const dependenciesForExecuteResourceAction: DependenciesForExecuteResourceAction = {
    getAllEvents: framework.getAllEvents,
    commitEvents: framework.commitEvents,
    logger: dummyLogger,
  };
  const dependenciesForCommands = {
    commitEvents: framework.commitEvents,
    getAllEvents: framework.getAllEvents,
    logger: dummyLogger,
  };
  return {
    ...framework,
    abortTest,
    commandHelpers: createCommandHelpers(dependenciesForExecuteResourceAction),
    dependenciesForViews: {
      ...framework.queries,
      ...happyPathExternalQueries,
      logger: dummyLogger,
    },
    dependenciesForCommands,
    dependenciesForSagas: {
      ...framework.queries,
      ...happyPathExternalQueries,
      ...dependenciesForCommands,
      sendCoarNotification: () => TE.right(undefined),
    },
  };
};
