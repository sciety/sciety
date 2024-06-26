import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { annotations } from './annotations';
import { evaluatedArticlesLists } from './evaluated-articles-lists';
import { evaluations } from './evaluations';
import { followings } from './followings';
import { groupActivity } from './group-activity';
import { groupAuthorisations } from './group-authorisations';
import { groups } from './groups';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists';
import { InitialisedReadModel, UnionToIntersection } from './initialised-read-model';
import { lists } from './lists';
import { Queries } from './queries';
import { users } from './users';
import { DomainEvent } from '../domain-events';
import { Logger } from '../logger';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (logger: Logger): Dispatcher => {
  const initialisedReadModels = [
    new InitialisedReadModel(annotations),
    new InitialisedReadModel(evaluations),
    new InitialisedReadModel(evaluatedArticlesLists),
    new InitialisedReadModel(followings),
    new InitialisedReadModel(groupActivity),
    new InitialisedReadModel(groupAuthorisations),
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
