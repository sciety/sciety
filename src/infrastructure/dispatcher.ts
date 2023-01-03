import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as groups from '../shared-read-models/groups';
import * as idsOfEvaluatedArticlesLists from '../shared-read-models/ids-of-evaluated-articles-lists';
import * as lists from '../shared-read-models/lists';
import * as users from '../shared-read-models/users';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: addArticleToElifeSubjectAreaList.Queries
  & lists.Queries
  & groups.Queries
  & idsOfEvaluatedArticlesLists.Queries
  & users.Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsReadModel = lists.initialState();
  let groupsReadModel = groups.initialState();
  let idsOfEvaluatedArticlesListsReadModel = idsOfEvaluatedArticlesLists.initialState();
  let usersReadModel = users.initialState();

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
    idsOfEvaluatedArticlesListsReadModel = RA.reduce(
      idsOfEvaluatedArticlesListsReadModel,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    usersReadModel = RA.reduce(
      usersReadModel,
      users.handleEvent,
    )(events);
  };

  const queries = {
    ...lists.queries(listsReadModel),
    ...addArticleToElifeSubjectAreaList.queries(addArticleToElifeSubjectAreaListReadModel),
    ...groups.queries(groupsReadModel),
    ...idsOfEvaluatedArticlesLists.queries(idsOfEvaluatedArticlesListsReadModel),
    ...users.queries(usersReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
