import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { ErrorMessage } from '../../../src/types/error-message';
import { ResourceAction } from '../../../src/write-side/resources/resource-action';

type State = E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const of = (events: ReadonlyArray<DomainEvent>): State => E.right(events);

type Concat = <A>(a: ReturnType<ResourceAction<A>>)
=> (previousState: State)
=> State;

export const concat: Concat = (action) => (previousState) => pipe(
  previousState,
  E.chain((previousEvents) => pipe(
    previousEvents,
    action,
    E.map((outputEvents) => [...previousEvents, ...outputEvents]),
  )),
);

type Last = <A>(a: ReturnType<ResourceAction<A>>)
=> (previousState: State)
=> State;

export const last: Last = (action) => (previousState) => pipe(
  previousState,
  E.chain((previousEvents) => pipe(
    previousEvents,
    action,
  )),
);
