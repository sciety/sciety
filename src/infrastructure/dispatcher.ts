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

type QueryBuilder<A, B> = (readModel: A) => B;

const wireUpQueries = <A, B>(
  queryBuilder: QueryBuilder<A, B>,
  readModelInstance: A,
): B => queryBuilder(readModelInstance);

type ReadModelWithInstance<I> = {
  instance: I,
  handleEvent: (state: I, event: DomainEvent) => I,
};

const updateInstance = (
  events: ReadonlyArray<DomainEvent>,
) => <I>(
  readModelWithInstance: ReadModelWithInstance<I>,
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
    },
    lists: { instance: listsReadModel, handleEvent: lists.handleEvent },
    groups: { instance: groupsReadModel, handleEvent: groups.handleEvent },
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModelsWithInstances.lists.instance = updateInstance(events)(readModelsWithInstances.lists);
    readModelsWithInstances.groups.instance = updateInstance(events)(readModelsWithInstances.groups);
    readModelsWithInstances.elife.instance = updateInstance(events)(readModelsWithInstances.elife);
  };

  const queries = {
    ...wireUpQueries(lists.queries, listsReadModel),
    ...wireUpQueries(addArticleToElifeSubjectAreaList.queries, addArticleToElifeSubjectAreaListReadModel),
    ...wireUpQueries(groups.queries, groupsReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
