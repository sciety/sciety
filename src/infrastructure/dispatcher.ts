import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as listsContent from '../shared-read-models/lists-content';
import * as groups from '../shared-read-models/stateful-groups';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: addArticleToElifeSubjectAreaList.Queries & listsContent.Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsContentReadModel = listsContent.initialState();
  let groupsReadModel = groups.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    listsContentReadModel = RA.reduce(
      listsContentReadModel,
      listsContent.handleEvent,
    )(events);
    groupsReadModel = RA.reduce(
      groupsReadModel,
      groups.handleEvent,
    )(events);
  };

  const queries = {
    ...listsContent.queries(listsContentReadModel),
    ...addArticleToElifeSubjectAreaList.queries(addArticleToElifeSubjectAreaListReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
