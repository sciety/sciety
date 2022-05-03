import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AnnotationCreatedEvent, DomainEvent } from '../domain-events';
import { annotationCreated, isAnnotationCreatedEvent } from '../domain-events/annotation-created-event';
import { AnnotationTarget, eqAnnotationTarget } from '../types/annotation-target';
import { HtmlFragment } from '../types/html-fragment';

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: AnnotationTarget,
};

type ExecuteCreateAnnotationCommand = (command: CreateAnnotationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<AnnotationCreatedEvent>;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = (command) => (events) => pipe(
  events,
  RA.filter(isAnnotationCreatedEvent),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [annotationCreated(command.target, command.content)],
    () => [],
  ),
);
