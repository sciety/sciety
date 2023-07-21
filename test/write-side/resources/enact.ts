import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { DomainEvent } from '../../../src/domain-events';
import { ResourceAction } from '../../../src/write-side/resources/resource-action';
import { ErrorMessage } from '../../../src/types/error-message';

type State = E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const of = (events: ReadonlyArray<DomainEvent>): State => E.right(events);

type Chain = <A>(a: ReturnType<ResourceAction<A>>)
=> (previousState: State)
=> State;

export const chain: Chain = (action) => (previousState) => pipe(
  previousState,
  E.chain((previousEvents) => pipe(
    previousEvents,
    action,
    E.map((outputEvents) => [...previousEvents, ...outputEvents]),
  )),
);
