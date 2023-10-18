import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  EventOfType, constructEvent, DomainEvent, isEventOfType,
} from '../../../domain-events';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { evaluationResourceError } from './evaluation-resource-error';
import { EvaluationType } from '../../../types/recorded-evaluation';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';

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
  authors: ReadonlyArray<string>,
};

type State = E.Either<ErrorMessage, WriteModel>;

const buildEvaluation = (state: State, event: RelevantEvent): State => {
  switch (event.type) {
    case 'EvaluationPublicationRecorded':
      return E.right({
        evaluationType: event.evaluationType,
        authors: event.authors,
      });
    case 'EvaluationUpdated':
      return pipe(
        state,
        E.match(
          () => E.left(toErrorMessage('')),
          (evaluationState) => E.right({
            evaluationType: event.evaluationType ?? evaluationState.evaluationType,
            authors: event.authors ?? evaluationState.authors,
          }),
        ),
      );
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
  RA.reduce(E.left(evaluationResourceError.doesNotExist), buildEvaluation),
);

const calculateAttributesToUpdate = (command: UpdateEvaluationCommand) => (writeModel: WriteModel) => ({
  evaluationType: (command.evaluationType !== undefined
    && command.evaluationType !== writeModel.evaluationType)
    ? command.evaluationType
    : undefined,
  authors: (command.authors !== undefined
    && command.authors !== writeModel.authors)
    ? command.authors
    : undefined,
});

const hasAnyValues = (attributes: Record<string, unknown | undefined>): boolean => (
  (attributes.evaluationType !== undefined)
  || (attributes.authors !== undefined)
);

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => (allEvents) => pipe(
  allEvents,
  constructWriteModel(command.evaluationLocator),
  E.map(calculateAttributesToUpdate(command)),
  E.map((attributesToChange) => (hasAnyValues(attributesToChange)
    ? [
      constructEvent('EvaluationUpdated')({
        evaluationLocator: command.evaluationLocator,
        ...attributesToChange,
      }),
    ]
    : [])),
);
