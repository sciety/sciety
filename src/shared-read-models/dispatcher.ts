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

const readModels = {
  articleActivity,
  curationStatements,
  evaluations,
};

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModelStates = {
    addArticleToElifeSubjectAreaList: addArticleToElifeSubjectAreaList.initialState(),
    annotations: annotations.initialState(),
    followings: followings.initialState(),
    groupActivity: groupActivity.initialState(),
    groups: groups.initialState(),
    idsOfEvaluatedArticlesLists: idsOfEvaluatedArticlesLists.initialState(),
    lists: lists.initialState(),
    users: users.initialState(),
    ...pipe(
      readModels,
      R.map((rm) => ({
        state: rm.initialState(),
        handleEvent: rm.handleEvent,
      })),
      (initialised) => initialised as {
        [K in keyof typeof readModels]: {
          state: ReturnType<typeof readModels[K]['initialState']>,
          handleEvent: typeof readModels[K]['handleEvent'],
        }
      },
    ),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    readModelStates.addArticleToElifeSubjectAreaList = RA.reduce(
      readModelStates.addArticleToElifeSubjectAreaList,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    readModelStates.annotations = RA.reduce(
      readModelStates.annotations,
      annotations.handleEvent,
    )(events);
    readModelStates.articleActivity.state = RA.reduce(
      readModelStates.articleActivity.state,
      readModelStates.articleActivity.handleEvent,
    )(events);
    readModelStates.curationStatements.state = RA.reduce(
      readModelStates.curationStatements.state,
      readModelStates.curationStatements.handleEvent,
    )(events);
    readModelStates.evaluations.state = RA.reduce(
      readModelStates.evaluations.state,
      readModelStates.evaluations.handleEvent,
    )(events);
    readModelStates.followings = RA.reduce(
      readModelStates.followings,
      followings.handleEvent,
    )(events);
    readModelStates.groupActivity = RA.reduce(
      readModelStates.groupActivity,
      groupActivity.handleEvent,
    )(events);
    readModelStates.groups = RA.reduce(
      readModelStates.groups,
      groups.handleEvent,
    )(events);
    readModelStates.idsOfEvaluatedArticlesLists = RA.reduce(
      readModelStates.idsOfEvaluatedArticlesLists,
      idsOfEvaluatedArticlesLists.handleEvent,
    )(events);
    readModelStates.lists = RA.reduce(
      readModelStates.lists,
      lists.handleEvent,
    )(events);
    readModelStates.users = RA.reduce(
      readModelStates.users,
      users.handleEvent,
    )(events);
  };

  const queries = {
    ...addArticleToElifeSubjectAreaList.queries(readModelStates.addArticleToElifeSubjectAreaList),
    ...annotations.queries(readModelStates.annotations),
    ...pipe(articleActivity.queries, R.map((builder) => builder(readModelStates.articleActivity.state))),
    ...pipe(
      evaluations.queries,
      R.map(
        (builder) => builder(readModelStates.evaluations.state),
      ),
      (foo) => foo as { [K in keyof typeof evaluations.queries]: ReturnType<typeof evaluations.queries[K]> },
    ),
    ...pipe(curationStatements.queries, R.map((builder) => builder(readModelStates.curationStatements.state))),
    ...followings.queries(readModelStates.followings),
    ...groupActivity.queries(readModelStates.groupActivity),
    ...groups.queries(readModelStates.groups),
    ...idsOfEvaluatedArticlesLists.queries(readModelStates.idsOfEvaluatedArticlesLists),
    ...lists.queries(readModelStates.lists),
    ...users.queries(readModelStates.users),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
