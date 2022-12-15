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

export const dispatcher = (): Dispatcher => {
  const allReadModels = {
    a: new InitialisedReadModel(elife.initialState, elife.handleEvent, elife.queries),
    b: new InitialisedReadModel(lists.initialState, lists.handleEvent, lists.queries),
    c: new InitialisedReadModel(groups.initialState, groups.handleEvent, groups.queries),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => pipe(
    Object.values(allReadModels),
    RA.map((elem) => elem.dispatch(events)),
  );

  const queries = {
    ...allReadModels.a.queries,
    ...allReadModels.b.queries,
    ...allReadModels.c.queries,
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
