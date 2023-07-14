import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  EventOfType, constructEvent, DomainEvent, isEventOfType,
} from '../../../domain-events';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { toErrorMessage } from '../../../types/error-message';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { EvaluationType } from '../../../types/recorded-evaluation';

const findInterestingEvents = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is EventOfType<'EvaluationRecorded'> | EventOfType<'EvaluationUpdated'> => isEventOfType('EvaluationRecorded')(event)
    || isEventOfType('EvaluationUpdated')(event)),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
  RA.match(
    () => E.left(toErrorMessage('Evaluation to be updated does not exist')),
    (es) => E.right(es),
  ),
);

const shouldUpdateEvaluationType = (evaluationType: EvaluationType) => (events: RNEA.ReadonlyNonEmptyArray<EventOfType<'EvaluationRecorded'> | EventOfType<'EvaluationUpdated'>>) => pipe(
  events,
  RNEA.last,
  (e) => (e.evaluationType !== evaluationType),
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  findInterestingEvents(command.evaluationLocator),
  E.map((events) => pipe(
    events,
    shouldUpdateEvaluationType(command.evaluationType),
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
