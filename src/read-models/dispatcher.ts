import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events/index.js';
import { articleActivity } from './article-activity/index.js';
import { Queries } from './queries.js';
import { evaluations } from './evaluations/index.js';
import { InitialisedReadModel, UnionToIntersection } from './initialised-read-model.js';
import { annotations } from './annotations/index.js';
import { followings } from './followings/index.js';
import { groupActivity } from './group-activity/index.js';
import { groups } from './groups/index.js';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists/index.js';
import { lists } from './lists/index.js';
import { users } from './users/index.js';
import { elifeSubjectAreaLists } from './elife-subject-area-lists/index.js';
import { evaluatedArticlesLists } from './evaluated-articles-lists/index.js';
import { Logger } from '../infrastructure/index.js';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (logger: Logger): Dispatcher => {
  const initialisedReadModels = [
    new InitialisedReadModel(elifeSubjectAreaLists),
    new InitialisedReadModel(annotations),
    new InitialisedReadModel(articleActivity),
    new InitialisedReadModel(evaluations),
    new InitialisedReadModel(evaluatedArticlesLists),
    new InitialisedReadModel(followings),
    new InitialisedReadModel(groupActivity),
    new InitialisedReadModel(groups),
    new InitialisedReadModel(idsOfEvalutedArticlesLists),
    new InitialisedReadModel(lists),
    new InitialisedReadModel(users),
  ];

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    pipe(
      initialisedReadModels,
      RA.mapWithIndex((index, readModel) => {
        const result = readModel.dispatch(events);
        logger('debug', 'Events handled by read model', { index });
        return result;
      }),
    );
  };

  const queries = pipe(
    initialisedReadModels,
    RA.map((readModel) => readModel.queries),
    (arrayOfQueries) => arrayOfQueries.reduce(
      (collectedQueries, query) => ({ ...collectedQueries, ...query }),
    ) as UnionToIntersection<typeof arrayOfQueries[number]>,
  );

  return {
    queries,
    dispatchToAllReadModels,
  };
};
