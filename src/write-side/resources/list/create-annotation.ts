import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { eqAnnotationTarget } from '../../../types/annotation-target';
import { isEventOfType, constructEvent } from '../../../domain-events';
import { CreateAnnotationCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const createAnnotation: ResourceAction<CreateAnnotationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('AnnotationCreated')),
  RA.filter((event) => eqAnnotationTarget.equals(event.target, command.target)),
  RA.match(
    () => [constructEvent('AnnotationCreated')({ target: command.target, content: command.content })],
    () => [],
  ),
  E.right,
);
