import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as DomainEvent from '../domain-events'; // Magic import to avoid ts-unused-exports complaining about domain-events/index.ts
import { AnnotationTarget, eqAnnotationTarget } from '../types/annotation-target';
import { HtmlFragment } from '../types/html-fragment';

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: AnnotationTarget,
};

type ExecuteCreateAnnotationCommand = (command: CreateAnnotationCommand)
=> (events: ReadonlyArray<DomainEvent.DomainEvent>)
=> ReadonlyArray<DomainEvent.AnnotationCreatedEvent>;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = (command) => (events) => pipe(
  events,
  RA.filter(DomainEvent.isAnnotationCreatedEvent),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [DomainEvent.annotationCreated(command.target, command.content)],
    () => [],
  ),
);
