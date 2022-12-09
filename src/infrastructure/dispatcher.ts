import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
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
  const all = {
    elife: new InitialisedReadModel(elife.initialState, elife.handleEvent, elife.queries),
    lists: new InitialisedReadModel(lists.initialState, lists.handleEvent, lists.queries),
    groups: new InitialisedReadModel(groups.initialState, groups.handleEvent, groups.queries),
  };

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => pipe(
    all,
    R.map((irm) => irm.dispatch(events)),
  );

  const queries = {
    ...all.elife.queries,
    ...all.lists.queries,
    ...all.groups.queries,
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
