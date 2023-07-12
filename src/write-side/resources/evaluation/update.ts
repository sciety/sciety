import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { constructEvent, DomainEvent, isEventOfType } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { EvaluationLocator } from '../../../types/evaluation-locator';

const findInterestingEvents = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('EvaluationRecorded')),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
  RA.match(
    () => E.left(toErrorMessage('no recorded evaluation found')),
    (es) => E.right(es),
  ),
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  findInterestingEvents(command.evaluationLocator),
  E.map((events) => pipe(
    events,
    RA.filter((e) => e.evaluationType !== command.evaluationType),
    RA.isNonEmpty,
    B.fold(
      () => [],
      () => [
        constructEvent('EvaluationUpdated')({
          evaluationLocator: command.evaluationLocator,
          evaluationType: command.evaluationType,
        }),
      ],
    ),
  )),
);
