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

const dispatch = <S>(
  events: ReadonlyArray<DomainEvent>,
  rm: {
    state: S,
    handleEvent: (state: S, event: DomainEvent) => S,
  }): void => {
  // eslint-disable-next-line no-param-reassign
  rm.state = RA.reduce(rm.state, rm.handleEvent)(events);
};

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  const readModelStates = pipe(
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
  );

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
    dispatch(events, readModelStates.articleActivity);
    dispatch(events, readModelStates.curationStatements);
    dispatch(events, readModelStates.evaluations);

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

  const queries = {
    ...pipe(articleActivity.queries, R.map((builder) => builder(readModelStates.articleActivity.state))),
    ...pipe(curationStatements.queries, R.map((builder) => builder(readModelStates.curationStatements.state))),
    ...pipe(
      evaluations.queries,
      R.map((query) => query(readModelStates.evaluations.state)),
      (queriesWithAccessToState) => queriesWithAccessToState as {
        [K in keyof typeof evaluations.queries]: ReturnType<typeof evaluations.queries[K]>
      },
    ),

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
