import * as RA from 'fp-ts/ReadonlyArray';
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

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsReadModel = lists.initialState();
  let groupsReadModel = groups.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    listsReadModel = RA.reduce(
      listsReadModel,
      lists.handleEvent,
    )(events);
    groupsReadModel = RA.reduce(
      groupsReadModel,
      groups.handleEvent,
    )(events);
  };

  const queries = {
    ...lists.queries(listsReadModel),
    ...addArticleToElifeSubjectAreaList.queries(addArticleToElifeSubjectAreaListReadModel),
    ...groups.queries(groupsReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
