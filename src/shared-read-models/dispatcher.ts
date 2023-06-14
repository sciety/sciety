import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as annotations from './annotations';
import * as evaluations from './evaluations';
import { curationStatements } from './curation-statements';
import * as followings from './followings';
import * as groupActivity from './group-activity';
import * as groups from './groups';
import * as idsOfEvaluatedArticlesLists from './ids-of-evaluated-articles-lists';
import * as lists from './lists';
import * as users from './users';
import * as articleActivity from './article-activity';
import { Queries } from './queries';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModels = {
    addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.initialState(),
    annotationsReadModel: annotations.initialState(),
    articleActivityReadModel: articleActivity.initialState(),
    curationStatementsReadModel: curationStatements.initialState(),
    evaluationsReadModel: evaluations.initialState(),
    followingsReadModel: followings.initialState(),
    groupActivityReadModel: groupActivity.initialState(),
    groupsReadModel: groups.initialState(),
    idsOfEvaluatedArticlesListsReadModel: idsOfEvaluatedArticlesLists.initialState(),
    listsReadModel: lists.initialState(),
    usersReadModel: users.initialState(),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModels.addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      readModels.addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    readModels.annotationsReadModel = RA.reduce(
      readModels.annotationsReadModel,
      annotations.handleEvent,
    )(events);
    readModels.articleActivityReadModel = RA.reduce(
      readModels.articleActivityReadModel,
      articleActivity.handleEvent,
    )(events);
    readModels.curationStatementsReadModel = RA.reduce(
      readModels.curationStatementsReadModel,
      curationStatements.handleEvent,
    )(events);
    readModels.evaluationsReadModel = RA.reduce(
      readModels.evaluationsReadModel,
      evaluations.handleEvent,
    )(events);
    readModels.followingsReadModel = RA.reduce(
      readModels.followingsReadModel,
      followings.handleEvent,
    )(events);
    readModels.groupActivityReadModel = RA.reduce(
      readModels.groupActivityReadModel,
      groupActivity.handleEvent,
    )(events);
    readModels.groupsReadModel = RA.reduce(
      readModels.groupsReadModel,
      groups.handleEvent,
    )(events);
    readModels.idsOfEvaluatedArticlesListsReadModel = RA.reduce(
      readModels.idsOfEvaluatedArticlesListsReadModel,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    readModels.listsReadModel = RA.reduce(
      readModels.listsReadModel,
      lists.handleEvent,
    )(events);
    readModels.usersReadModel = RA.reduce(
      readModels.usersReadModel,
      users.handleEvent,
    )(events);
  };

  const queries = {
    ...addArticleToElifeSubjectAreaList.queries(readModels.addArticleToElifeSubjectAreaListReadModel),
    ...annotations.queries(readModels.annotationsReadModel),
    ...articleActivity.queries(readModels.articleActivityReadModel),
    ...pipe(curationStatements.queries, R.map((builder) => builder(readModels.curationStatementsReadModel))),
    ...evaluations.queries(readModels.evaluationsReadModel),
    ...followings.queries(readModels.followingsReadModel),
    ...groupActivity.queries(readModels.groupActivityReadModel),
    ...groups.queries(readModels.groupsReadModel),
    ...idsOfEvaluatedArticlesLists.queries(readModels.idsOfEvaluatedArticlesListsReadModel),
    ...lists.queries(readModels.listsReadModel),
    ...users.queries(readModels.usersReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
