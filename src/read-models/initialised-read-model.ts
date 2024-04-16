import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';

export class InitialisedReadModel<S, Q > {
  private state: S;

  private handleEvent: (state: S, e: DomainEvent) => S;

  dispatch(events: ReadonlyArray<DomainEvent>): void {
    this.state = pipe(
      events,
      RA.reduce(this.state, this.handleEvent),
    );
  }

  queries: Q;

  constructor(
    readModel: {
      initialState: () => S,
      handleEvent: (s: S, e: DomainEvent) => S,
      queries: { [K in keyof Q]: (state: S) => Q[K] },
    },
  ) {
    this.state = readModel.initialState();
    this.handleEvent = readModel.handleEvent;
    this.queries = {} as Q;
    // eslint-disable-next-line no-loops/no-loops, no-restricted-syntax
    for (const k in readModel.queries) {
      if (Object.hasOwn(readModel.queries, k)) {
        this.queries[k] = readModel.queries[k](this.state);
      }
    }
  }
}

export type UnionToIntersection<U> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends any ? (k: U) => void : never
) extends ((k: infer I) => void) ? I : never;
