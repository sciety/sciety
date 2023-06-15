import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as annotations from './annotations';
import { curationStatements } from './curation-statements';
import * as followings from './followings';
import * as groupActivity from './group-activity';
import * as groups from './groups';
import * as idsOfEvaluatedArticlesLists from './ids-of-evaluated-articles-lists';
import * as lists from './lists';
import * as users from './users';
import { articleActivity } from './article-activity';
import { Queries } from './queries';
import { evaluations } from './evaluations';
import { InitialisedReadModel, UnionToIntersection } from './initialised-read-model';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const initialisedReadModels = [
    new InitialisedReadModel(articleActivity),
    new InitialisedReadModel(curationStatements),
    new InitialisedReadModel(evaluations),
  ];

  const oldReadModelStates = {
    addArticleToElifeSubjectAreaList: addArticleToElifeSubjectAreaList.initialState(),
    annotations: annotations.initialState(),
    followings: followings.initialState(),
    groupActivity: groupActivity.initialState(),
    groups: groups.initialState(),
    idsOfEvaluatedArticlesLists: idsOfEvaluatedArticlesLists.initialState(),
    lists: lists.initialState(),
    users: users.initialState(),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    pipe(
      initialisedReadModels,
      RA.map((readModel) => readModel.dispatch(events)),
    );

    oldReadModelStates.addArticleToElifeSubjectAreaList = RA.reduce(
      oldReadModelStates.addArticleToElifeSubjectAreaList,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    oldReadModelStates.annotations = RA.reduce(
      oldReadModelStates.annotations,
      annotations.handleEvent,
    )(events);
    oldReadModelStates.followings = RA.reduce(
      oldReadModelStates.followings,
      followings.handleEvent,
    )(events);
    oldReadModelStates.groupActivity = RA.reduce(
      oldReadModelStates.groupActivity,
      groupActivity.handleEvent,
    )(events);
    oldReadModelStates.groups = RA.reduce(
      oldReadModelStates.groups,
      groups.handleEvent,
    )(events);
    oldReadModelStates.idsOfEvaluatedArticlesLists = RA.reduce(
      oldReadModelStates.idsOfEvaluatedArticlesLists,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    oldReadModelStates.lists = RA.reduce(
      oldReadModelStates.lists,
      lists.handleEvent,
    )(events);
    oldReadModelStates.users = RA.reduce(
      oldReadModelStates.users,
      users.handleEvent,
    )(events);
  };

  const queriesFromInitialisedReadModels = pipe(
    initialisedReadModels,
    RA.map((readModel) => readModel.queries),
    (arrayOfQueries) => arrayOfQueries.reduce(
      (collectedQueries, query) => ({ ...collectedQueries, ...query }),
    ) as UnionToIntersection<typeof arrayOfQueries[number]>,
  );

  const queries = {
    ...queriesFromInitialisedReadModels,

    ...addArticleToElifeSubjectAreaList.queries(oldReadModelStates.addArticleToElifeSubjectAreaList),
    ...annotations.queries(oldReadModelStates.annotations),
    ...followings.queries(oldReadModelStates.followings),
    ...groupActivity.queries(oldReadModelStates.groupActivity),
    ...groups.queries(oldReadModelStates.groups),
    ...idsOfEvaluatedArticlesLists.queries(oldReadModelStates.idsOfEvaluatedArticlesLists),
    ...lists.queries(oldReadModelStates.lists),
    ...users.queries(oldReadModelStates.users),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
