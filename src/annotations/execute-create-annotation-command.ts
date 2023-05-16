import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AnnotationTarget, eqAnnotationTarget } from '../types/annotation-target';
import { HtmlFragment } from '../types/html-fragment';
import {
  DomainEvent, EventOfType, isEventOfType, constructEvent,
} from '../domain-events';

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: AnnotationTarget,
};

type ExecuteCreateAnnotationCommand = (command: CreateAnnotationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<EventOfType<'AnnotationCreated'>>;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('AnnotationCreated')),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [constructEvent('AnnotationCreated')({ target: command.target, content: command.content })],
    () => [],
  ),
);
