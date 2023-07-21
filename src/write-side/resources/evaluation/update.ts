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

type EvaluationEvent = EventOfType<'EvaluationRecorded'> | EventOfType<'EvaluationUpdated'>;

const filterToHistoryOf = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is EvaluationEvent => isEventOfType('EvaluationRecorded')(event)
    || isEventOfType('EvaluationUpdated')(event)),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
);

const shouldUpdateEvaluationType = (
  evaluationType: EvaluationType,
) => (evaluationHistory: RNEA.ReadonlyNonEmptyArray<EvaluationEvent>) => pipe(
  evaluationHistory,
  RNEA.last,
  E.right,
  E.filterOrElse(
    (event) => !isEventOfType('IncorrectlyRecordedEvaluationErased')(event),
    () => toErrorMessage('Evaluation to be updated does not exist'),
  ),
  E.map((event) => (event.evaluationType !== evaluationType)),
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  filterToHistoryOf(command.evaluationLocator),
  RA.match(
    () => E.left(toErrorMessage('Evaluation to be updated does not exist')),
    (history) => E.right(history),
  ),
  E.chainW((evaluationHistory) => pipe(
    evaluationHistory,
    shouldUpdateEvaluationType(command.evaluationType),
    E.map(B.fold(
      () => [],
      () => [
        constructEvent('EvaluationUpdated')({
          evaluationLocator: command.evaluationLocator,
          evaluationType: command.evaluationType,
        }),
      ],
    )),
  )),
);
