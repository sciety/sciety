import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { readmodel as addArticleToElifeSubjectAreaList } from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import { readmodel as groups } from '../shared-read-models/groups';
import { readmodel as idsOfEvaluatedArticlesLists } from '../shared-read-models/ids-of-evaluated-articles-lists';
import { readmodel as lists } from '../shared-read-models/lists';
import { readmodel as users } from '../shared-read-models/users';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: ReturnType<typeof addArticleToElifeSubjectAreaList.queries>
  & ReturnType<typeof groups.queries>
  & ReturnType<typeof idsOfEvaluatedArticlesLists.queries>
  & ReturnType<typeof lists.queries>
  & ReturnType<typeof users.queries>,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const all = pipe(
    {
      addArticleToElifeSubjectAreaList,
      groups,
      idsOfEvaluatedArticlesLists,
      lists,
      users,
    },
    R.map((r) => ({ ...r, state: r.initialState() })),
  );

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
