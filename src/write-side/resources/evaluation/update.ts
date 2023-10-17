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
import { evaluationResourceError } from './evaluation-resource-error';
import { EvaluationType } from '../../../types/recorded-evaluation';
import { ErrorMessage } from '../../../types/error-message';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'EvaluationUpdated'> | EventOfType<'IncorrectlyRecordedEvaluationErased'> | EventOfType<'EvaluationRemovalRecorded'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => isEventOfType('EvaluationPublicationRecorded')(event)
|| isEventOfType('EvaluationUpdated')(event)
|| isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
|| isEventOfType('EvaluationRemovalRecorded')(event);

const filterToHistoryOf = (evaluationLocator: EvaluationLocator) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
);

type WriteModel = {
  evaluationType: EvaluationType | undefined,
  authors: ReadonlyArray<string> | undefined,
};

const buildEvaluation = (event: RelevantEvent) => {
  switch (event.type) {
    case 'EvaluationPublicationRecorded':
    case 'EvaluationUpdated':
      return E.right({
        evaluationType: event.evaluationType,
        authors: undefined,
      });
    case 'IncorrectlyRecordedEvaluationErased':
      return E.left(evaluationResourceError.doesNotExist);
    case 'EvaluationRemovalRecorded':
      return E.left(evaluationResourceError.previouslyRemovedCannotUpdate);
  }
};

const constructWriteModel = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, WriteModel> => pipe(
  events,
  filterToHistoryOf(evaluationLocator),
  RA.match(
    () => E.left(evaluationResourceError.doesNotExist),
    (history) => E.right(history),
  ),
  E.chainW((evaluationHistory) => pipe(
    evaluationHistory,
    RNEA.last,
    buildEvaluation,
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
        authors: undefined,
      }),
    ],
  )),
);
