import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as groups from '../shared-read-models/groups';
import * as lists from '../shared-read-models/lists';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: addArticleToElifeSubjectAreaList.Queries
  & lists.Queries
  & groups.Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

const wireUpQueries = <I, Q>(
  readModelWithInstance: ReadModelWithInstance<I, Q>,
): Q => readModelWithInstance.queryBuilder(readModelWithInstance.instance);

type ReadModelWithInstance<I, Q> = {
  instance: I,
  handleEvent: (state: I, event: DomainEvent) => I,
  queryBuilder: (instance: I) => Q,
};

const updateInstance = (
  events: ReadonlyArray<DomainEvent>,
) => <I, Q>(
  readModelWithInstance: ReadModelWithInstance<I, Q>,
): I => pipe(
    events,
    RA.reduce(readModelWithInstance.instance, readModelWithInstance.handleEvent),
  );

export const dispatcher = (): Dispatcher => {
  const addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  const listsReadModel = lists.initialState();
  const groupsReadModel = groups.initialState();

  const readModelsWithInstances = {
    elife: {
      instance: addArticleToElifeSubjectAreaListReadModel,
      handleEvent: addArticleToElifeSubjectAreaList.handleEvent,
      queryBuilder: addArticleToElifeSubjectAreaList.queries,
    },
    lists: { instance: listsReadModel, handleEvent: lists.handleEvent, queryBuilder: lists.queries },
    groups: { instance: groupsReadModel, handleEvent: groups.handleEvent, queryBuilder: groups.queries },
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModelsWithInstances.elife.instance = updateInstance(events)(readModelsWithInstances.elife);
    readModelsWithInstances.lists.instance = updateInstance(events)(readModelsWithInstances.lists);
    readModelsWithInstances.groups.instance = updateInstance(events)(readModelsWithInstances.groups);
  };

  const queries = {
    ...wireUpQueries(readModelsWithInstances.elife),
    ...wireUpQueries(readModelsWithInstances.lists),
    ...wireUpQueries(readModelsWithInstances.groups),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
