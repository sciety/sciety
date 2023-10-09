import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { eqAnnotationTarget } from '../types/annotation-target';
import {
  DomainEvent, EventOfType, isEventOfType, constructEvent,
} from '../domain-events';
import { CreateAnnotationCommand } from '../write-side/commands';

type ExecuteCreateAnnotationCommand = (command: CreateAnnotationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<never, ReadonlyArray<EventOfType<'AnnotationCreated'>>>;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('AnnotationCreated')),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [constructEvent('AnnotationCreated')({ target: command.target, content: command.content })],
    () => [],
  ),
  E.right,
);
