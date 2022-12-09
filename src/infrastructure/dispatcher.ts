import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as elife from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent } from '../domain-events';
import * as groups from '../shared-read-models/groups';
import * as lists from '../shared-read-models/lists';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: elife.Queries
  & lists.Queries
  & groups.Queries,
  dispatchToAllReadModels: DispatchToAllReadModels,
};

class InitialisedReadModel<I, Q> {
  private instance: I;

  private handleEvent: (state: I, e: DomainEvent) => I;

  dispatch(events: ReadonlyArray<DomainEvent>) {
    this.instance = pipe(
      events,
      RA.reduce(this.instance, this.handleEvent),
    );
  }

  queries: Q;

  constructor(
    initialState: () => I,
    handleEvent: (s: I, e: DomainEvent) => I,
    buildQueries: (instance: I) => Q,
  ) {
    this.instance = initialState();
    this.handleEvent = handleEvent;
    this.queries = buildQueries(this.instance);
  }
}

// taken from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export const dispatcher = (): Dispatcher => {
  const allInitialisedReadModels = [
    new InitialisedReadModel(elife.initialState, elife.handleEvent, elife.queries),
    new InitialisedReadModel(lists.initialState, lists.handleEvent, lists.queries),
    new InitialisedReadModel(groups.initialState, groups.handleEvent, groups.queries),
  ];

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => pipe(
    allInitialisedReadModels,
    RA.map((elem) => elem.dispatch(events)),
  );

  const queries = pipe(
    allInitialisedReadModels,
    RA.map((elem) => elem.queries),
    (arrayOfQueries) => arrayOfQueries.reduce(
      (acc, elem) => ({ ...acc, ...elem }),
    ) as UnionToIntersection<typeof arrayOfQueries[number]>,
  );

  return {
    queries,
    dispatchToAllReadModels,
  };
};
