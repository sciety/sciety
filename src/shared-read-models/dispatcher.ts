import * as RA from 'fp-ts/ReadonlyArray';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as annotations from './annotations';
import * as evaluations from './evaluations';
import * as followings from './followings';
import * as groups from './groups';
import * as idsOfEvaluatedArticlesLists from './ids-of-evaluated-articles-lists';
import * as lists from './lists';
import * as users from './users';
import * as articleActivity from './article-activity';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

export type Queries = addArticleToElifeSubjectAreaList.Queries
& annotations.Queries
& articleActivity.Queries
& evaluations.Queries
& followings.Queries
& groups.Queries
& idsOfEvaluatedArticlesLists.Queries
& lists.Queries
& users.Queries;

// ts-unused-exports:disable-next-line
export type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModels = {
    addArticleToElifeSubjectAreaListReadModel: addArticleToElifeSubjectAreaList.initialState(),
    annotationsReadModel: annotations.initialState(),
    articleActivityReadModel: articleActivity.initialState(),
    evaluationsReadModel: evaluations.initialState(),
    followingsReadModel: followings.initialState(),
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
    readModels.evaluationsReadModel = RA.reduce(
      readModels.evaluationsReadModel,
      evaluations.handleEvent,
    )(events);
    readModels.followingsReadModel = RA.reduce(
      readModels.followingsReadModel,
      followings.handleEvent,
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
    ...evaluations.queries(readModels.evaluationsReadModel),
    ...followings.queries(readModels.followingsReadModel),
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
