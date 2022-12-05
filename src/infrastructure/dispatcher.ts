import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as lists from '../shared-read-models/lists';
import { getList } from '../shared-read-models/lists/get-list';
import { isArticleOnTheListOwnedBy } from '../shared-read-models/lists/is-article-on-the-list-owned-by';
import { selectAllListsOwnedBy } from '../shared-read-models/lists/select-all-lists-owned-by';
import * as groups from '../shared-read-models/stateful-groups';
import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

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
  const latestListsReadModel: IO.IO<lists.ReadModel> = () => listsReadModel;
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
    isArticleOnTheListOwnedBy: (userId: UserId) => (articleId: Doi) => pipe(
      latestListsReadModel,
      // query is always passed the latest read model, so it cannot (accidentally) cache it
      IO.map(isArticleOnTheListOwnedBy),
      IO.map((original) => original(userId)(articleId)),
      (foo) => foo,
    ),
    selectAllListsOwnedBy: selectAllListsOwnedBy(listsReadModel),
    getList: getList(listsReadModel),
    ...addArticleToElifeSubjectAreaList.queries(addArticleToElifeSubjectAreaListReadModel),
    ...groups.queries(groupsReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
