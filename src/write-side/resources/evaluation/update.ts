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
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { evaluationDoesNotExist } from './evaluation-does-not-exist';
import { EvaluationType } from '../../../types/recorded-evaluation';
import { ErrorMessage } from '../../../types/error-message';

type RelevantEvent = EventOfType<'EvaluationRecorded'> | EventOfType<'EvaluationUpdated'> | EventOfType<'IncorrectlyRecordedEvaluationErased'> | EventOfType<'EvaluationRemovalRecorded'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => isEventOfType('EvaluationRecorded')(event)
|| isEventOfType('EvaluationUpdated')(event)
|| isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
|| isEventOfType('EvaluationRemovalRecorded')(event);

const filterToHistoryOf = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
);

type WriteModel = { evaluationType: EvaluationType | undefined };

const constructWriteModel = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, WriteModel> => pipe(
  events,
  filterToHistoryOf(evaluationLocator),
  RA.match(
    () => E.left(evaluationDoesNotExist),
    (history) => E.right(history),
  ),
  E.chainW((evaluationHistory) => pipe(
    evaluationHistory,
    RNEA.last,
    (event) => {
      switch (event.type) {
        case 'EvaluationRecorded':
        case 'EvaluationUpdated':
          return E.right({ evaluationType: event.evaluationType });
        case 'IncorrectlyRecordedEvaluationErased':
          return E.left(evaluationDoesNotExist);
        case 'EvaluationRemovalRecorded':
          return E.left(evaluationDoesNotExist);
      }
    },
  )),
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  constructWriteModel(command.evaluationLocator),
  E.map((writeModel) => (writeModel.evaluationType !== command.evaluationType)),
  E.map(B.fold(
    () => [],
    () => [
      constructEvent('EvaluationUpdated')({
        evaluationLocator: command.evaluationLocator,
        evaluationType: command.evaluationType,
      }),
    ],
  )),
);
