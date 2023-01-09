import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as groups from '../shared-read-models/groups';
import * as idsOfEvaluatedArticlesLists from '../shared-read-models/ids-of-evaluated-articles-lists';
import { readmodel as lists } from '../shared-read-models/lists';
import { readmodel as users } from '../shared-read-models/users';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: addArticleToElifeSubjectAreaList.Queries
  & groups.Queries
  & idsOfEvaluatedArticlesLists.Queries
  & ReturnType<typeof lists.queries>
  & ReturnType<typeof users.queries>,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModels = {
    addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.initialState(),
    listsReadModel: lists.initialState(),
    groupsReadModel: groups.initialState(),
    idsOfEvaluatedArticlesListsReadModel: idsOfEvaluatedArticlesLists.initialState(),
    usersReadModel: users.initialState(),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModels.addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      readModels.addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    readModels.listsReadModel = RA.reduce(
      readModels.listsReadModel,
      lists.handleEvent,
    )(events);
    readModels.groupsReadModel = RA.reduce(
      readModels.groupsReadModel,
      groups.handleEvent,
    )(events);
    readModels.idsOfEvaluatedArticlesListsReadModel = RA.reduce(
      readModels.idsOfEvaluatedArticlesListsReadModel,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    readModels.usersReadModel = RA.reduce(
      readModels.usersReadModel,
      users.handleEvent,
    )(events);
  };

  const queries = {
    ...lists.queries(readModels.listsReadModel),
    ...addArticleToElifeSubjectAreaList.queries(readModels.addArticleToElifeSubjectAreaListReadModel),
    ...groups.queries(readModels.groupsReadModel),
    ...idsOfEvaluatedArticlesLists.queries(readModels.idsOfEvaluatedArticlesListsReadModel),
    ...users.queries(readModels.usersReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
