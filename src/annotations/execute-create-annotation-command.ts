import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { eqAnnotationTarget } from '../types/annotation-target';
import { isEventOfType, constructEvent } from '../domain-events';
import { CreateAnnotationCommand } from '../write-side/commands';
import { ResourceAction } from '../write-side/resources/resource-action';

export const executeCreateAnnotationCommand: ResourceAction<CreateAnnotationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('AnnotationCreated')),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [constructEvent('AnnotationCreated')({ target: command.target, content: command.content })],
    () => [],
  ),
  E.right,
);
