import { createActions, createCommandHelpers } from './create-command-helpers';
import { createReadAndWriteSides } from './create-read-and-write-sides';
import { createHappyPathThirdPartyAdapters } from './happy-path-third-party-adapters';
import { Dependencies as DependenciesForExecuteResourceAction } from '../../src/write-side/resources/execute-resource-action';
import * as listPromotionResource from '../../src/write-side/resources/list-promotion';
import { abortTest } from '../abort-test';
import { dummyLogger } from '../dummy-logger';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createTestFramework = () => {
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
    writeResources: {
      listPromotion: createActions(dependenciesForExecuteResourceAction, listPromotionResource.actions),
    },
    happyPathThirdParties,
    dependenciesForViews: {
      ...framework.queries,
      ...happyPathThirdParties,
      logger: dummyLogger,
    },
  };
};

export type TestFramework = ReturnType<typeof createTestFramework>;
