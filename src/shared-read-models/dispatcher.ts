import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
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

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModels = {
    addArticleToElifeSubjectAreaList: addArticleToElifeSubjectAreaList.initialState(),
    annotations: annotations.initialState(),
    articleActivity: articleActivity.initialState(),
    curationStatements: curationStatements.initialState(),
    evaluations: evaluations.initialState(),
    followings: followings.initialState(),
    groupActivity: groupActivity.initialState(),
    groups: groups.initialState(),
    idsOfEvaluatedArticlesLists: idsOfEvaluatedArticlesLists.initialState(),
    lists: lists.initialState(),
    users: users.initialState(),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModels.addArticleToElifeSubjectAreaList = RA.reduce(
      readModels.addArticleToElifeSubjectAreaList,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    readModels.annotations = RA.reduce(
      readModels.annotations,
      annotations.handleEvent,
    )(events);
    readModels.articleActivity = RA.reduce(
      readModels.articleActivity,
      articleActivity.handleEvent,
    )(events);
    readModels.curationStatements = RA.reduce(
      readModels.curationStatements,
      curationStatements.handleEvent,
    )(events);
    readModels.evaluations = RA.reduce(
      readModels.evaluations,
      evaluations.handleEvent,
    )(events);
    readModels.followings = RA.reduce(
      readModels.followings,
      followings.handleEvent,
    )(events);
    readModels.groupActivity = RA.reduce(
      readModels.groupActivity,
      groupActivity.handleEvent,
    )(events);
    readModels.groups = RA.reduce(
      readModels.groups,
      groups.handleEvent,
    )(events);
    readModels.idsOfEvaluatedArticlesLists = RA.reduce(
      readModels.idsOfEvaluatedArticlesLists,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    readModels.lists = RA.reduce(
      readModels.lists,
      lists.handleEvent,
    )(events);
    readModels.users = RA.reduce(
      readModels.users,
      users.handleEvent,
    )(events);
  };

  const queries = {
    ...addArticleToElifeSubjectAreaList.queries(readModels.addArticleToElifeSubjectAreaList),
    ...annotations.queries(readModels.annotations),
    ...pipe(articleActivity.queries, R.map((builder) => builder(readModels.articleActivity))),
    ...pipe(
      evaluations.queries,
      R.map(
        (builder) => builder(readModels.evaluations),
      ),
      (foo) => foo as { [K in keyof typeof evaluations.queries]: ReturnType<typeof evaluations.queries[K]> },
    ),
    ...pipe(curationStatements.queries, R.map((builder) => builder(readModels.curationStatements))),
    ...followings.queries(readModels.followings),
    ...groupActivity.queries(readModels.groupActivity),
    ...groups.queries(readModels.groups),
    ...idsOfEvaluatedArticlesLists.queries(readModels.idsOfEvaluatedArticlesLists),
    ...lists.queries(readModels.lists),
    ...users.queries(readModels.users),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
